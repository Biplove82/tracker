function getEmailTemplate(otp){
  return `
<html>
  <head>
    <title>Tracker</title>
    <style>
      .fa {
        padding: 10px;
        font-size: 20px;
        width: 20px;
        text-align: center;
        text-decoration: none;
        margin: 2px 2px;
      }
      .fa:hover {
          opacity: 0.7;
      }
      .fa-facebook {
        background: #3B5998;
        color: white;
      }
      .fa-linkedin {
        background: #007bb5;
        color: white;
      }
      .fa-youtube {
        background: #bb0000;
        color: white;
      }
    </style>
  </head>
  <body>
  <div> <p>Your OTP for password reset is :</p><h3 style="color:blue"> ${otp},</h3></div>
    <div style="color:rgb(34,34,34);direction:ltr;margin:8px 0px 0px;padding:0px;font-size:0.875rem;font-family:Roboto,RobotoDraft,Helvetica,Arial,sans-serif">
      <div style="font-stretch:normal;font-size:small;line-height:1.5;font-family:Arial,Helvetica,sans-serif;overflow:hidden">
        <div dir="ltr">
          <div dir="ltr">
            <div dir="ltr">
              <table cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" width="420" height="198" style="color:rgb(0,0,0);font-family:&quot;Times New Roman&quot;;font-size:medium;width:420px;height:198px;border-collapse:collapse">
                <tbody>
                  <tr>
                    <td>
                      
                      <table cellpadding="0" cellspacing="0" width="193" height="56" style="width:193px;height:56px;border-collapse:collapse">
                        <tbody>
                          <tr>
                            <td width="293" height="58" bgcolor="#FFFFFF" valign="middle" align="center" style="width:293px;height:58px;padding:0px">
                              <p style="width:250px;font-family:&quot;sans-serif Condensed&quot;,sans-serif;font-weight:700;color:rgb(62,0,119);font-size:14px;text-transform:uppercase;letter-spacing:0px;margin:0px;padding:0px">IT TEAM</p>
                              <p style="width:293px;font-family:&quot;Roboto Condensed&quot;,sans-serif;color:rgb(44,50,59);font-size:12px;text-transform:uppercase;letter-spacing:2px;margin:0px;padding:0px">
                                <b>IT DEPARTMENT</b>
                              </p>
                             
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                    <td width="227" height="120" style="width:327px;height:120px;padding:0px">
                      <table cellpadding="0" cellspacing="0" width="393" height="100" style="width:393px;height:120px;border-collapse:collapse;border-top-color:rgb(44,50,59);border-bottom-color:rgb(44,50,59)">
                        <tbody>
                          <tr>
                            <td width="259" height="56" style="width:259px;height:46px;padding:0px">
                              <p style="width:289.062px;font-family:&quot;Roboto Condensed&quot;,sans-serif;font-size:12px;letter-spacing:0.8px;margin:0px 0px 0px 20px;padding:0px">
                                <b>Corporate Address</b><br>Second Floor B-58 B, Sector 60,<br> Noida, UP - 201301
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td width="259" height="52" style="width:259px;height:32px;padding:0px">
                              <p style="width:289.062px;font-family:&quot;Roboto Condensed&quot;,sans-serif;font-size:12px;letter-spacing:0.8px;margin:0px 0px 0px 20px;padding:0px">
                                <a href="mailto:info@slnkoenergy.com" target="_blank">info@SLnkoenergy.com</a>
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td width="259" height="56" style="width:259px;height:36px;padding:0px">
                              <p style="width:289.062px;font-family:&quot;Roboto Condensed&quot;,sans-serif;font-size:12px;letter-spacing:0.8px;margin:0px 0px 0px 20px;padding:0px">
                                
                              </p>
                            </td>
                          </tr>
                          <tr>
                            <td colspan="2">

                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
                <table cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" width="620" height="15" style="width:620px;height:15px;border-collapse:collapse">
            <tbody>
                <tr valign="middle" align="center">
                     
                    </tr>
            </tbody>
        </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`}

module.exports = getEmailTemplate;