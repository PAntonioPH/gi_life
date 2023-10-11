export const messageNewAccount = `<!doctype html>
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

      .wrapper {
          width: 100%;
          table-layout: fixed;
          background-color: #cccccc;
          padding-bottom: 60px;
      }

      .main {
          background-color: white;
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

      .box {
          border: 3px solid grey;
          width: 300px;
          align-content: center;
          display: inline;
          margin: 10px;
          padding: 10px;
          border-radius: 5px;
      }
  </style>
  <title>Verificar Cuenta</title>
</head>

<body>
<div class="wrapper">

  <table class="main">
    <!--    -------------;-->
    <tr>
      <td height="8" style="background-color:#f08efe;"></td>
    </tr>

    <!--    -------------;-->
    <tr>
      <td style="padding: 14px 0 4px">
        <table width="100%">
          <tr style="background-color: #0d153b">
            <td class="two-columns">
              <table class="column">
                <tr>
                  <td style="padding: 20px 60px">
                    <a href="https://eduardoriverasantamaria.com/" target="_blank" class="spacing">
                      <img src="https://eduardoriverasantamaria.s3.us-west-2.amazonaws.com/logo1.2.png" alt="Eduardo Rivera Santamaría" width="180" title="Eduardo Rivera Santamaría">
                    </a>
                  </td>
                </tr>
              </table>

              <table class="column">
                <tr>
                  <td>
                    <a>
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_fb.png" alt="Eduardo Rivera Santamaría" width="30%" title="fb">
                    </a>
                    <a>
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_ig.png" alt="Eduardo Rivera Santamaría" width="30%" title="ig">
                    </a>
                    <a>
                      <img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_tw.png" alt="Eduardo Rivera Santamaría" width="30%" title="tw">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!--          --------------------------;-->
          <tr>
            <td>
              <table>
                <tr>
                  <td style="text-align: center;padding: 15px">
                    <p style="font-size: 30px">¡Estimado/a <strong>{{user}}</strong>!</p>
                    <p>Gracias por registrarte en nuestra plataforma. Para garantizar la seguridad de tu cuenta, estamos llevando a cabo un proceso de verificación.

                    <div class="box">
                      {{code}}
                    </div>

                    <p>Este proceso nos ayudará a confirmar tu identidad y asegurarnos de que tu cuenta esté protegida. Si tienes alguna pregunta o encuentras algún problema durante este proceso, no dudes en contactarnos</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <tr>
            <td>
              <a><img src="https://eduardoriverasantamaria.s3.us-west-2.amazonaws.com/BANNER_ERS%20M.png" alt="Eduardo Rivera Santamaría" width="100%" title="Eduardo Rivera Santamaría"> </a>
            </td>
          </tr>

          <tr>
            <td style="background-color: #0d153b">
              <table width="100%">
                <tr>
                  <td style="text-align: center;padding-top: 15px; color: #ffffffff">
                    <a href="https://eduardoriverasantamaria.com/"><img src="https://eduardoriverasantamaria.s3.us-west-2.amazonaws.com/icono.png" alt="Eduardo Rivera Santamaría" width="25%" title="Eduardo Rivera Santamaría"></a>
                    <p>Eduardo Rivera Santamaría</p>

                    <a href="https://eduardoriverasantamaria.com/" target="_blank">
                      <p>eduardoriverasantamaria.com</p>
                    </a>
                    <a><img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_fb.png" alt="Eduardo Rivera Santamaría" width="70" title="fb"> </a>
                    <a><img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_ig.png" alt="Eduardo Rivera Santamaría" width="70" title="fb"> </a>
                    <a><img src="https://unicornio.s3.us-east-2.amazonaws.com/bw_tw.png" alt="Eduardo Rivera Santamaría" width="70" title="fb"> </a>
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