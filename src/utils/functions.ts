import {jwtVerify} from "jose";
import process from "process";
import {NextApiRequest} from "next";
import moment from "moment";

const {NEXT_PUBLIC_SECRET} = process.env

export const message = (message: string, response?: [] | {}) => {
  return {
    message: message,
    response: response,
  };
};

export const validar_llaves = (keys_required: Record<string, any>, body: object): Promise<{ message: string, success: boolean }> => {
  return new Promise((resolve) => {
    const llaves_body = Object.keys(body);

    for (let i = 0; i < keys_required.length; i++) {
      if (llaves_body.indexOf(keys_required[i]) < 0) {
        resolve({
          message: `La llave ${keys_required[i]} es obligatoria`,
          success: false,
        });
        break;
      }
    }
    resolve({
      message: "",
      success: true,
    });
  });
};

export const filtrar_llaves = (body: object, keys_filter: Record<string, any>): object => {
  return new Promise((resolve) => {
    const llaves_body = Object.keys(body);
    const values_body = Object.values(body);
    let llaves_filtradas: Record<string, any> = {}

    keys_filter.forEach((llave: string) => {
      const indice = llaves_body.indexOf(llave.replaceAll("'", ""));
      if (indice >= 0) llaves_filtradas[llave] = values_body[indice]
    })
    resolve(llaves_filtradas)
  });
}

export const filtrar_llaves_multiple = (bodys: Array<object>, keys_filter: Record<string, any>): any => {
  return new Promise((resolve) => {
    let llaves_filtradas: Array<object> = []

    bodys.forEach((body: object) => {
      const llaves_body = Object.keys(body);
      const values_body = Object.values(body);
      let llave_filtrada: Record<string, any> = {}

      keys_filter.forEach((llave: string) => {
        const indice = llaves_body.indexOf(llave.replaceAll("'", ""));
        if (indice >= 0) llave_filtrada[llave] = values_body[indice]
      })

      llaves_filtradas = [...llaves_filtradas, llave_filtrada]
    });

    resolve(llaves_filtradas)
  });
}

export const get_fecha = (parseUtc?: boolean) => parseUtc ? moment().utc().format('YYYY-MM-DD') : moment().format('YYYY-MM-DD')

export const get_hora = (parseUtc?: boolean) => parseUtc ? moment().utc().format('HH:mm:ss') : moment().format('HH:mm:ss')

export const validate_login = (validation: string) => {
  const regex = new RegExp("\"", "g");
  return validation.replaceAll(" ", "").replaceAll("'", "").replaceAll(regex, "'");
}

export const validate_cookie = async (req: NextApiRequest, nameCookie: string) => {
  try {
    const {cookie} = req.headers;
    if (!cookie) return {}

    const jwt = cookie.split(";").filter((item) => item.indexOf(nameCookie) >= 0)[0].split("=")[1];

    const {payload} = await jwtVerify(
      jwt,
      new TextEncoder().encode(NEXT_PUBLIC_SECRET)
    );

    return payload
  } catch (e) {
    return {}
  }
}

export const removeAccents = (text: string) => {
  const mapaAcentos: { [key: string]: string } = {
    'á': 'a', 'é': 'e', 'í': 'i', 'ó': 'o', 'ú': 'u',
    'Á': 'A', 'É': 'E', 'Í': 'I', 'Ó': 'O', 'Ú': 'U',
    'à': 'a', 'è': 'e', 'ì': 'i', 'ò': 'o', 'ù': 'u',
    'À': 'A', 'È': 'E', 'Ì': 'I', 'Ò': 'O', 'Ù': 'U',
    'â': 'a', 'ê': 'e', 'î': 'i', 'ô': 'o', 'û': 'u',
    'Â': 'A', 'Ê': 'E', 'Î': 'I', 'Ô': 'O', 'Û': 'U',
    'ã': 'a', 'õ': 'o',
    'Ã': 'A', 'Õ': 'O',
    'ä': 'a', 'ë': 'e', 'ï': 'i', 'ö': 'o', 'ü': 'u',
    'Ä': 'A', 'Ë': 'E', 'Ï': 'I', 'Ö': 'O', 'Ü': 'U',
    'ç': 'c', 'Ç': 'C',
  };

  return text.replace(/[\u00C0-\u00FF]/g, char => mapaAcentos[char] || char);
};