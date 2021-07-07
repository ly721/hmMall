// pages/goods_details/goods_details.js
import {request} from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {}
  },
    goodsInfo:{},
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { goods_id } = options;
    this.getGoodsObj(goods_id);
  },
  async getGoodsObj(goods_id){
    const goodsObj = await request({url: "/goods/detail",data:{goods_id}});
    this.data.goodsInfo = goodsObj;
    this.setData({
      goodsObj:{
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g,'.jpg'),
        pics: goodsObj.pics
      }
    })
  },
  handleBigImage(e){
    const urls = this.data.goodsInfo.pics.map(v=>v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current,
      urls
    });
  },
  // 加入购物车
  // 1、绑定点击事件
  // 2、获取缓存中的购物车数据   数据格式是数组[]
  // 3、判断当前商品在购物车列表有没有
  // 4、已经存在修改数据++  修改购物车数据
  // 5、不存在添加商品，且商品数量为1
  // 6、弹框提示添加成功
  handleAddCart(){
     let  cart = wx.getStorageSync("cart") || [];
     
     let index = cart.findIndex(v=>v.goods_id === this.data.goodsInfo.goods_id);
    
     if(index === -1){
       this.data.goodsInfo.num = 1;
       this.data.goodsInfo.checked = true;
       cart.push(this.data.goodsInfo);
     }else{
       cart[index].num++;
     }
     
     wx.setStorageSync("cart",cart);
     wx.showToast({
       title: '加入成功',
       icon: 'succes',
       mask: true
     });
       
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