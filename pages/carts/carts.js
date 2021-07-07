// pages/carts/carts.js
import {getSetting, openSetting, chooseAddress} from '../../utils/asyncWx.js';
import {regeneratorRuntime} from "../../lib/runtime/runtime";
Page({

  /**
   * 页面的初始数据
   */
  data: {
     address:{},
     cartLists:[],
     allChecked: false,
     totalPrice: 0,
     totalNum: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  /**
   * 获取用户收货地址 使用api  wx.chooseAddress
   * 
   * 但是需要注意：
   * 需要先获取用户对小程序授权（wx.getSetting）获取用户地址信息状态 scope
   *  1.如果用户点击获取地址提示框确定 authSetting scope.address
   * scope值 true
   * 2. 用户点击取消 
   * scope值 false
   *  诱导用户打开授权设置界面(wx.openSetting) 重新获取地址授权权限
   * 3.用户没有点击过获取地址的API
   * scope值 undefined
   */
  async handleAddress(){
   
      // wx.getSetting({
      //   success: (result) => {
      //     const scopeAddress = result.authSetting["scope.address"];
      //     if(scopeAddress===true || scopeAddress===undefined){
      //         wx.chooseAddress({
      //           success: (res) => {
      //             console.log(res)
      //           }
      //         });
      //     }else{
      //          wx.openSetting({
      //            success: (result2) => {
      //              wx.chooseAddress({
      //                success: (result3) => {
      //                    console.log(result3);
      //                }
      //              });
                     
      //            },
      //          });
                 
      //     }
      //   }
      // });
        try {
           const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if(scopeAddress===false){
        await openSetting();
      }
      const res2 = await chooseAddress();
      wx.setStorageSync("address",res2);
        } catch (error) {
          console.log(error);
        }
     
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  //商品选中
  // 获取选中商品id
  // 获取购物车列表数据
  // 通过索引找到被修改商品对象，修改选中状态
  // 把购物车数据和缓存数据刷新
  handleCheckGoods(e){
    const {id} = e.target.dataset;
    let {cartLists} = this.data;
    let index = cartLists.findIndex(v=>v.goods_id === id);
    cartLists[index].checked = !cartLists[index].checked;
    wx.setStorageSync('cart', cartLists);
     this.setData({
       cartLists
     }) 
    let allChecked = true;
    let totalNum = 0;
    let totalPrice = 0;
       cartLists.forEach(v=>{
         if(v.checked){
            totalNum += v.num;
            totalPrice += v.goods_price * v.num;
         }else {
           allChecked = false;
         }
       })
       allChecked = cartLists.length===0?false:allChecked;
       this.setData({
        cartLists,
        allChecked,
        totalPrice,
        totalNum
      })
  },
  handleCheckAll(){
  // 将缓存中和购物车列表数据每个商品的checked状态改成和allChecked状态一样
   
   let allChecked = !this.data.allChecked;
   let {cartLists} = this.data;
   cartLists.map(v=>v.checked = allChecked);
   this.setData({
     allChecked
   })
   this.setCart(cartLists);
   
  },
  //减少购物车数量
  //首先查看num大小，如果等于1问用户是否删除商品
  // 涉及购物车列表和缓存数据的变化，同时修改总价格和总数量，
  handleNumReduce(e){
  //  获取当前购物车列表
  let { cartLists } = this.data;
  let { id } = e.target.dataset;
  let index = cartLists.findIndex(v=>v.goods_id === id);
  if(cartLists[index].num === 1){
    wx.showModal({
      title: '提示',
      content: '是否删除当前商品',
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
      
        if (result.confirm) {
          cartLists.splice(index,1);
          this.setCart(cartLists)
        }
      },
      fail: () => {},
      complete: () => {}
    });
      
  }else{
    cartLists[index].num--;
  }
 this.setCart(cartLists);
  },
  handleNumAdd(e){
    let { cartLists } = this.data;
    let {id } = e.target.dataset;
    let index = cartLists.findIndex(v=>v.goods_id === id);
    if(cartLists[index].num>=cartLists[index].goods_number){
      wx.showToast({
        title: '商品不能再增加啦',
        icon: 'none',
        duration: 1500,
        mask: true
      });
    }else{
      cartLists[index].num++;
    }
    
  this.setCart(cartLists);
  },
  setCart(cartLists){
    let totalNum = 0;
  let totalPrice = 0;
  cartLists.forEach(v=>{
    if(v.checked){
       totalNum += v.num;
       totalPrice += v.goods_price * v.num;
    }
  })
  this.setData({
    cartLists,
    totalPrice,
    totalNum
  })
  wx.setStorageSync('cart',cartLists);
  },
  // 商品结算
  handlePay(){
    const {address,totalNum} = this.data;
    if(!address.userName){
      wx.showToast({
        title: '您还没有选择收货地址',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
        return;
    }
    if(totalNum === 0){
      wx.showToast({
        title: '您还没有选购商品',
        icon: 'none',
        duration: 1500,
        mask: false,
      });
        return;
    }
    wx.navigateTo({
      url: '/pages/pays/pays'
    });
      
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
      // 获取缓存中的地址信息
      const address = wx.getStorageSync("address");
      const cartLists = wx.getStorageSync("cart") || [];
        // 商品全选 设置参数allChecked监听
        // 遍历我们商品列表，使用every函数，判断每一个商品是否都被选中，全部都选中返回true，否则返回false
        // 注意：遍历数组是空数组的话，every返回true
       let allChecked = true;
       let totalNum = 0;
       let totalPrice = 0;
       cartLists.forEach(v=>{
         if(v.checked){
            totalNum += v.num;
            totalPrice += v.goods_price * v.num;
         }else {
           allChecked = false;
         }
       })
       allChecked = cartLists.length===0?false:allChecked;
       this.setData({
        address,
        cartLists,
        allChecked,
        totalPrice,
        totalNum
      })
  },

  /**
   * 生命周期函数--监听页面隐藏;
   * 
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