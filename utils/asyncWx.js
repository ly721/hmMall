export const getSetting = function(){
    return new Promise((resolve,reject)=>{
        wx.getSetting({
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            }
        });
    })
}
export const chooseAddress = function(){
    return new Promise((resolve,reject)=>{
        wx.chooseAddress({
          success: (result) => {
           resolve(result);
           },
          fail: (err) => {
              reject(err);
          }
      });
    })
}
export const openSetting = function(){
    return new Promise((resolve,reject)=>{
        wx.openSetting({
          success: (result) => {
           resolve(result);
           },
          fail: (err) => {
              reject(err);
          }
      });
    })
}

  

  