// pages/goods_lists/goods_lists.js
import { request} from'../../request/index';
import { regeneratorRuntime } from'../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      { 
        id: 0,
        name:'综合',
        isActive: true
      },
      { 
        id: 1,
        name:'销量',
        isActive: false
      },
      { 
        id: 2,
        name:'价格',
        isActive: false
      }
    ],
    goodsList:[]
  },
  queryParams:{
    query: '',
    cid: '',
    pageNum: 1,
    pageSize: 10,
  },
  totalPages: 1,
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryParams.cid = options.cid;
    this.getGoodsList();
  },
 async getGoodsList(){
    const res = await request({url:'/goods/search',data:this.queryParams});
    const total = res.total;
    this.totalPages = Math.ceil(total/this.queryParams.pageSize);
    this.setData({
      goodsList: [...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新窗口
    wx.stopPullDownRefresh();
      
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
    // 触发下拉刷新需要在页面的JSON文件中开启一个配置项
    //  页面数据全部重置
    this.setData({
      goodsList: []
    })
    // 重置页码为1
    this.queryParams.pageNum = 1;
    // 重新发送请求
    this.getGoodsList();
    // 数据请求回来之后关闭下拉刷新加载串口
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    // 判断是否有下一页数据
         //  获取总页数=Math.ceil（res.total/页容量pagesize）和当前数据页数pagenum比较判断
    // 有就加载显示下一页数据
      // 当前页码 ++
      // 重新发送请求
      // 数据请求回来 要对data中的数组 进行拼接而不是全部替换
    //否则提示用户
    if(this.queryParams.pageNum >= this.totalPages){
          wx.showToast({
            title: '没有下一页数据',
            icon: 'none',
            image: '',
            duration: 1500,
            mask: false
          });
            
    }else{
      this.queryParams.pageNum++;
      this.getGoodsList();
    }
  },
  tabItemChange(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
    this.setData({
      tabs
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})