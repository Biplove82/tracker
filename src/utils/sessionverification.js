function getSessionVerfication(
  otp,
  emp_id,
  name,
  device_id,
  ip,
  latitude,
  longitude,
  fullAddress
) {
  return `
<html>
  <head>
    <title> Tracker </title>
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
  <div> <p style="color:red"> <strong>Device Information and Login Information are following :</strong></p> </div>
  <div> <strong>Employee Id :</strong> ${emp_id} </div>
  <div> <strong>Employee Name :</strong> ${name} </div>
  <div> <strong>Device Id :</strong> ${device_id} </div>
  <div> <strong>IP Address :</strong> ${ip} </div>
  <div> <strong>Latitude :</strong> ${latitude} </div>
   <div> <strong>Longitude :</strong> ${longitude} </div>
    <div> <strong>Full Address :</strong> ${fullAddress} </div>
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
                       </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
                <table cellpadding="0" cellspacing="0" bgcolor="#FFFFFF" width="620" height="15" style="width:620px;height:15px;border-collapse:collapse">
           
        </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  </body>
</html>
`;
}

module.exports = getSessionVerfication;