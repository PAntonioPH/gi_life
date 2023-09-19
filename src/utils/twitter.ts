import {TwitterApi} from 'twitter-api-v2';

const twitterClient = new TwitterApi({
  appKey: "L0r2W0IJ14iNsa08sdJtjoo0v",
  appSecret: "BxwBceeduJHBzBBadFr8psKNZX7TlyYI4OwTYhCGiQyAYyjxpe",
  accessToken: "1659610157465190419-0yVZO6QAPleVetv6CFJwcr82qCPNuy",
  accessSecret: "yBVcyI1qu9II4VDRRk478psS7yuUZ17zsPxxqlL0Fh6Eh",
})

export const postTwitter = async (message: string, link:string) => {
  new Promise(async (resolve, reject) => {
    try {
      await twitterClient.v2.tweet(`${message} \n\n\n${link}`)
    } catch (err) {
      reject(err)
    }
  })
}