import {PutObjectCommand, S3Client} from "@aws-sdk/client-s3";
import fs from "fs";
import {v4 as uuid} from 'uuid';
import path from "path";
import sharp from "sharp";
import moment from "moment";

const {NEXT_PUBLIC_AWS_BUCKET_REGION, NEXT_PUBLIC_AWS_BUCKET_NAME, NEXT_PUBLIC_AWS_PUBLIC_KEY, NEXT_PUBLIC_AWS_SECRET_KEY} = process.env;

const client = new S3Client({
  region: NEXT_PUBLIC_AWS_BUCKET_REGION,
  credentials: {
    accessKeyId: NEXT_PUBLIC_AWS_PUBLIC_KEY as string,
    secretAccessKey: NEXT_PUBLIC_AWS_SECRET_KEY as string,
  }
})

const reducerQuality = (type: string, tempFilePathInput: string, tempFilePathUploads: string) => {
  return new Promise((resolve) => {
    switch (type) {
      case 'png':
        sharp(tempFilePathInput).withMetadata().png({quality: 80}).toFile(tempFilePathUploads, () => resolve({}))
        break;
      case 'jpg':
      case 'jfif':
      case 'pjp':
      case 'pjpeg':
      case 'jpeg':
        sharp(tempFilePathInput).withMetadata().jpeg({quality: 80}).toFile(tempFilePathUploads, () => resolve({}))
        break;
      case "webp":
        sharp(tempFilePathInput).withMetadata().webp({quality: 80}).toFile(tempFilePathUploads, () => resolve({}))
        break;
      default:
        fs.copyFileSync(tempFilePathInput, tempFilePathUploads);
        resolve({})
        break;
    }
  })
}

export const uploadFile = async (file64: string, file: string, nameAlternative?: string) => {
  const fileSplit = file.replaceAll(" ", '-').split('.');

  const type = fileSplit[fileSplit.length - 1];
  const name = fileSplit.slice(0, fileSplit.length - 1).join('.');

  const base64Data = file64.replace(/^data:image\/png;base64,/, '');
  const tempFolderPathInput = path.join('./tmp/input');
  const tempFolderPathUploads = path.join('./tmp/uploads');
  const tempFilePathInput = path.join(tempFolderPathInput, `${name}.${type}`);
  const tempFilePathUploads = path.join(tempFolderPathUploads, `${name}.${type}`);

  try {
    fs.mkdirSync(tempFolderPathInput, {recursive: true});
    fs.mkdirSync(tempFolderPathUploads, {recursive: true});
    fs.writeFileSync(tempFilePathInput, base64Data, {
      flag: 'w',
      encoding: 'base64'
    });

    await reducerQuality(type, tempFilePathInput, tempFilePathUploads);

    const stream = fs.createReadStream(tempFilePathUploads);
    const newFilename = nameAlternative && nameAlternative != "" ? `${nameAlternative}-${moment().format("YYYY-MM-DD-HH-mm-ss")}-${uuid()}.${type}` : `${name}-${uuid()}.${type}`;

    let uploadParams: any = {
      Bucket: NEXT_PUBLIC_AWS_BUCKET_NAME,
      Key: newFilename,
      Body: stream,
    }

    if (type === "pdf") uploadParams = {...uploadParams, ContentType: "application/pdf"}

    const command = new PutObjectCommand({...uploadParams,})
    await client.send(command)

    fs.unlinkSync(tempFilePathInput);
    fs.unlinkSync(tempFilePathUploads);

    return {
      success: true,
      response: {
        url: `https://${NEXT_PUBLIC_AWS_BUCKET_NAME}.s3.${NEXT_PUBLIC_AWS_BUCKET_REGION}.amazonaws.com/${newFilename}`,
        name: newFilename
      }
    };
  } catch (e) {
    console.log(e)
    try {
      fs.unlinkSync(tempFilePathInput);
      fs.unlinkSync(tempFilePathUploads);
    } catch (e) {
    }
    return {
      success: false,
    }
  }
}
