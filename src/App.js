import React, { useState, useEffect } from 'react';
import { lineItems } from './components/items';
import './App.css';
//Styling variables
// const BLUE = '#172162'; //"rgb(23, 33, 98)";
// const LIGHT_GREY = '#6e7484';
// const BLACK = '#000000';
//First part given
// const SUBTOTAL = 2094.97;
// const HST = 272.3461;
// const TOTAL = 2382.3161;
const ESTIMATED_DELIVERY = 'Nov 24, 2022';
const App = () => {
  var requestUrl;
  const [cartItems, setcartItems] = useState([]);
  const [postalCode, setpostalCode] = useState('');
  const [fees, setFees] = useState({
    subtotal: 0,
    tax: 0,
    shipping: 15,
    total: 0,
  });
  useEffect(() => {
    // url is hardcoded yet
    (async () => {
      if (postalCode) {
        requestUrl = `http://localhost:3001/api/line-items?postalCode=${postalCode}`;
      } else {
        requestUrl = `http://localhost:3001/api/line-items`;
      }
      fetch(`${requestUrl}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('data', data);
          if (data?.length) {
            setcartItems(data);
          }
        })
        .catch((error) => {
          console.error('Error fetching line items:', error);
        });
    })();
  }, [postalCode]);
  const calculateFees = () => {
    const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
    const tax = subtotal * 0.13;
    const total = subtotal + tax + fees.shipping;

    setFees({
      subtotal: subtotal.toFixed(2),
      tax: tax.toFixed(2),
      total: total.toFixed(2),
      shipping: fees?.shipping,
    });
  };
  useEffect(() => {
    // Calculate fees whenever the cartItems or fees.shipping change
    calculateFees();
  }, [cartItems, fees.shipping]);
  const removeLineItem = (lineItemId) => {
    setcartItems(cartItems?.filter((item) => item.id !== lineItemId));
  };
  const addLineItem = (lineItem) => {
    setcartItems([...cartItems, lineItem]);
  };
  return (
    <div className="max-w-6xl mx-auto px-[100px] py-3">
      <div className="flex justify-between mb-3">
        <h2 className="text-BLUE font-medium mb-3">Your Cart</h2>
        <button
          className="px-5 rounded border border-BLUE"
          onClick={() =>
            addLineItem({
              id: cartItems?.length + 1,
              title: 'Blue Sofa',
              price: 994.99,
              quantity: 1,
              image:
                'https://www.cozey.ca/_next/image?url=https%3A%2F%2Fcdn.shopify.com%2Fs%2Ffiles%2F1%2F0277%2F3057%2F5462%2Fproducts%2F3_Seater_SofaSofa_Ottoman_Off_Arm_Configuration_Two_Arms_Arm_Design_Slope_Chaise_Off_Fabric_Navy_Blue2.png%3Fv%3D1629231450&w=1920&q=75',
              swatchColor: '#191944',
              swatchTitle: 'Blue',
            })
          }
        >
          Add
        </button>
      </div>
      {cartItems?.length ? (
        <>
          {cartItems?.map((item, index) => {
            return (
              <div key={index} className="prod-image-panel flex justify-between mb-[32px]">
                <div className="flex">
                  <div className="product-image mr-3">
                    <img src={item.image} alt={item.title} className="w-[200px]" />
                  </div>
                  <div className="prod-desc-panel flex flex-col mr-[200px]">
                    <h5 className="text-BLUE text-xs font-bold mb-3">Dark fay white product 1</h5>
                    <div className="flex justify-left items-leftr">
                      <span style={{ background: item.swatchColor }} className="inline-block w-[20px] h-[20px] rounded-full mr-2"></span>
                      <span className="text-xs text-BLACK">{item.swatchTitle}</span>
                    </div>
                  </div>
                </div>

                <div className="prod-price-panel flex flex-col text-right">
                  <p className="mb-[40px] text-BLACK font-medium text-xs">$434.33 </p>
                  <div className="mb-3">
                    <span className="text-xs text-BLACK font-medium mr-1">Estimated Delivery Date:</span>
                    <span className="text-xs text-BLUE">{item.estimatedDeliveryDate || ESTIMATED_DELIVERY}</span>
                  </div>
                  <a className="text-xs text-BLACK underline cursor-pointer" onClick={() => removeLineItem(item.id)}>
                    Remove
                  </a>
                </div>
              </div>
            );
          })}

          <div className="flex justify-between mb-2">
            <p className="text-sm font-normal text-BLACK">Subtotal</p>
            <span className="text-sm font-medium text-BLACK">${fees?.subtotal}</span>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm text-BLACK">Taxes (estimated)</p>
            <span className="text-sm font-medium text-BLACK">${fees?.tax}</span>
          </div>
          <div className="flex justify-between mb-2">
            <p className="text-sm  text-BLACK">Shipping</p>
            <span className="text-sm font-medium text-BLACK">${fees?.shipping || 15}</span>
          </div>
          <div className="flex justify-between mb-[40px]">
            <p className="text-sm text-BLUE font-bold">Total</p>
            <span className="text-sm font-bold text-BLUE">${fees?.total}</span>
          </div>

          <div className="flex flex-col text-center mx-auto max-w-[400px]">
            <label>Enter postal code to check delivery date</label>
            <input
              className="border border-Black mt-3"
              type="text"
              value={postalCode}
              onChange={(e) => {
                if (e.target.value?.length <= 1) {
                  setpostalCode(e.target.value.toUpperCase());
                }
              }}
            />
          </div>
        </>
      ) : (
        <p className="text-center">There is 0 item in cart or please check your server request</p>
      )}
    </div>
  );
};

export default App;
