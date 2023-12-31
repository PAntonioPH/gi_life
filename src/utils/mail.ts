import {Resend} from 'resend';

const {NEXT_PUBLIC_RESEND_API_KEY, NEXT_PUBLIC_RESEND_EMAIL, NEXT_PUBLIC_RESEND_USER}= process.env;

const resend = new Resend(NEXT_PUBLIC_RESEND_API_KEY);

export const sendEmail = async (to: string, subject: string, message: string) => {
  try {
    const data = await resend.emails.send({
      from: `${NEXT_PUBLIC_RESEND_USER} <${NEXT_PUBLIC_RESEND_EMAIL}>`,
      to: [to],
      subject: subject,
      html: message,
    });

    console.log(data);

    const {id} = data;

    if (!id) {
      return ({
        success: false,
        message: "Error al enviar el correo"
      });
    }

    return ({
      success: true,
      message: "Correo enviado"
    });
  } catch (error) {
    console.log(error);
    return ({
      success: false,
      message: "Error al enviar el correo"
    });
  }
};

export const replaceParamsValues = (message: string, params: string[], values: string[]) => {
  let newMessage = message;

  params.forEach((param, index) => newMessage = newMessage.replaceAll(`{{${param}}}`, values[index]));

  return newMessage;
};
