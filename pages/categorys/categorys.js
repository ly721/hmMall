// pages/categorys/categorys.js
import { request } from '../../request/index.js';
import { regeneratorRuntime } from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    cateLeft:[],
    // 右侧菜单数据
    cateRight:[],
    currentIndex: 0,
    scrollTop: 0
  },
  // 所有数据
  cates:[],
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const cates = wx.getStorageSync("cates");
    if(!cates){
      this.getCates();
    }else{
      //判断过期不,定义时间5min
      if(Date.now()-cates.time>1000 * 60 * 5){
        this.getCates();
      }else{
         this.cates = cates.data;
         let cateLeft = this.cates.map(v=>v.cat_name);
         let cateRight = this.cates[0].children
         this.setData({
           cateLeft,
           cateRight
         })
      }
    }
  },
  // 获取分类数据
  async getCates(){
    const res = await request({url:'/categories'});
    this.cates = res;
    //  把获取数据存入本地缓存
     wx.setStorageSync('cates',{time:Date.now(),data:this.cates})
     let cateLeft = this.cates.map(v=>v.cat_name);
     let cateRight = this.cates[0].children
     this.setData({
       cateLeft,
       cateRight
     })

  //  request({url:'/categories'})
  //  .then(res=>{
  //    this.cates = res.data.message;
  //   //  把获取数据存入本地缓存
  //    wx.setStorageSync('cates',{time:Date.now(),data:this.cates})
  //    let cateLeft = this.cates.map(v=>v.cat_name);
  //    let cateRight = this.cates[0].children
  //    this.setData({
  //      cateLeft,
  //      cateRight
  //    })
  //  })
  },
  handleItemTap(e){
    let currentIndex = e.currentTarget.dataset.index;
    let cateRight=this.cates[currentIndex].children;
    this.setData({
      currentIndex,
      cateRight,
      scrollTop: 0
    })
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