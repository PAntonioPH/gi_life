export const messageRecoverPassword = `<!doctype html>
<html lang="es" xmlns="http://www.w3.org/1999/html">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <style>
      body {
          margin: 0;
          background-color: #cccccc;
      }

      table {
          border-spacing: 0;
      }

      td {
          padding: 0;
      }

      img {
          border: 0;
      }

      .box {
          border: 3px solid grey;
          width: 300px;
          align-content: center;
          display: inline;
          margin: 10px;
          padding: 10px;
          border-radius: 5px;
      }

      .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #cccccc;
          padding-bottom: 60px;
      }

      .main {
          background-color: #e1e1e1;
          margin: 0 auto;
          width: 100%;
          max-width: 600px;
          border-spacing: 0;
          font-family: sans-serif;
          color: #171a1b;
      }

      .two-columns {
          text-align: center;
          font-size: 0;
      }

      .two-columns .column {
          width: 100%;
          max-width: 300px;
          display: inline-block;
          vertical-align: top;
          text-align: center;
      }

      .spacing {
          padding: 1em 3px 30px 5px;
      }
  </style>
  <title>Recuperar Contraseña</title>
</head>

<body>
<div class="wrapper">

  <table class="main">
    <!--    -------------;-->
    <tr>
      <td height="8" style="background-color:#F08EFE;"></td>
    </tr>

    <!--    -------------;-->
    <tr>
      <td style="padding: 14px 0 4px">
        <table>
          <tr style="background-color: slategrey">
            <td class="two-columns">
              <table class="column">
                <tr>
                  <td style="padding: 20px 60px">
                    <a href="https://eduardoriverasantamaria.com/" target="_blank" class="spacing" style="padding: 10px; width: 10px">
                      <img src="https://eduardoriverasantamaria.s3.us-west-2.amazonaws.com/logo1.2.png" alt="Eduardo Rivera Santamaría" width="180" title="Eduardo Rivera Santamaría">
                    </a>
                  </td>
                </tr>
              </table>

              <table class="column">
                <tr>
                  <td>
                    <a href="https://www.facebook.com/LaloRiveraSantamaria1" target="_blank">
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_fb.png" alt="Eduardo Rivera Santamaría" width="30%" title="fb">
                    </a>
                    <a href="https://www.instagram.com/laloriverasantamaria/" target="_blank">
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_ig.png" alt="Eduardo Rivera Santamaría" width="30%" title="ig">
                    </a>
                    <a href="https://twitter.com/LaloRiveraSMR" target="_blank">
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_tw.png" alt="Eduardo Rivera Santamaría" width="30%" title="tw">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!--          --------------------------;-->

          <tr>
            <td style="text-align: center;padding: 15px">
              <hr>
              <p style="font-size: 30px; font-weight: bold">¿Haz olvidado tu contraseña?</p>
              <p>¡Hola <strong> {{user}}</strong>!</p>
              <p>Recibimos tu solicitud para restablecer tu contraseña. <strong>Sabemos lo frustrante que puede ser olvidarla, pero no te preocupes, estamos aquí para ayudarte.</strong></p>
            </td>
          </tr>

          <tr>
            <td style="text-align: center;padding: 15px">
              <label> Tu código de recuperación es: </label>
              <div class="box">
                {{code}}
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <table>
                <tr>
                  <td>
                    <a>
                      <img src="https://eduardoriverasantamaria.s3.us-west-2.amazonaws.com/contrase%C3%B1a.png" alt="Eduardo Rivera Santamaría" width="100%">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td style="background-color:darkgrey">
              <table>
                <tr>
                  <td style="text-align: center;padding: 15px">
                    <a href="https://google.com/"><img src="https://eduardoriverasantamaria.s3.us-west-2.amazonaws.com/icono.png" alt="Eduardo Rivera Santamaría" width="30%" title="Eduardo Rivera Santamaría"></a>
                    <p style="color: white">Eduardo Rivera Santamaría</p>
                    <p style="color: white"> eduardoriverasantamaria.com</p>
                    <a href="https://www.facebook.com/LaloRiveraSantamaria1" target="_blank">
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_fb.png" alt="Eduardo Rivera Santamaría" width="20%" title="fb">
                    </a>
                    <a href="https://www.instagram.com/laloriverasantamaria/" target="_blank">
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_ig.png" alt="Eduardo Rivera Santamaría" width="20%" title="ig">
                    </a>
                    <a href="https://twitter.com/LaloRiveraSMR" target="_blank">
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_tw.png" alt="Eduardo Rivera Santamaría" width="20%" title="tw">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</div>
</body>
</html>`