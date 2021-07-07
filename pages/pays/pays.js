// pages/pays/pays.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
     address:{},
     cartLists:[],
     totalNum:0,
     totalPrice:0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     
  const cartLists = wx.getStorageSync('cart') || [];
  // 注意这里列表是用户选中的商品
  let checkedCart = cartLists.filter(v=>v.checked);
  const address = wx.getStorageSync('address');
    
   let totalNum = 0;
  let totalPrice = 0;
  cartLists.forEach(v=>{
    if(v.checked){
       totalNum += v.num;
       totalPrice += v.goods_price * v.num;
    }
  })
  this.setData({
    cartLists:checkedCart,
      address,
    totalPrice,
    totalNum
  })
  wx.setStorageSync('cart',checkedCart);
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})