import axios from "axios";

const accessToken = "EAAUCDvcq1loBO1WpBBUwDShxbpBVnFozbIcRbpJ1KqsCVTI2oH5EXnoVgm968ekogJNULk7CiXUzJAjdggPIDRFvHpyI1qIfzdAsUyEHc3UZBoYzplQzGsI8wtMDd0vQH1z6sGBEBtHBgBPmyUqCGasSO6yoFehl0QzwRCqOwqx6DFqJCDe2HCgZDZD"

export const postFacebook = async (message: string, link: string) => {
  return new Promise(async (resolve, reject) => {
    try {
      const {data} = await axios.get(`https://graph.facebook.com/v16.0/me/accounts?access_token=${accessToken}`)

      const {access_token} = data.data[0]

      message = message.replaceAll("#", "%23")

      axios.post(`https://graph.facebook.com/v16.0/me/feed?access_token=${access_token}&link=${link}&message=${message}`)
        .then(res => {
          resolve(res.data)
        })
        .catch(err => {
          reject(err)
        })
    } catch (err) {
      reject(err)
    }
  })
}