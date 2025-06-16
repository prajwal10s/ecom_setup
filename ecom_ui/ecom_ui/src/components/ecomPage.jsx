import React, { useState, useEffect, useCallback } from "react";

import { ProductList } from "./productList.jsx";
import { Cart } from "./cart.jsx";
import { CheckoutForm } from "./checkoutForm.jsx";
import { AdminMetrics } from "./adminMetrics.jsx";
import { LoadingSpinner } from "./loadingSpinner.jsx";
import { Message } from "./message.jsx";

const API_BASE_URL = "http://localhost:3000/api";

const EcomPage = () => {
  const [products, setProducts] = useState([]);
  const [cartId, setCartId] = useState(localStorage.getItem("cartId"));
  const [cartDetails, setCartDetails] = useState(null);
  const [couponCode, setCouponCode] = useState("");
  const [orderConfirmation, setOrderConfirmation] = useState(null);
  const [adminMetrics, setAdminMetrics] = useState(null);
  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);

  // --- Helper for showing messages ---
  const showMessage = (text, type) => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 5000);
  };

  //Fetching data
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      showMessage(`Failed to load products: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getOrCreateCart = useCallback(async () => {
    setIsLoading(true);
    try {
      const url = cartId
        ? `${API_BASE_URL}/cart?cartId=${cartId}`
        : `${API_BASE_URL}/cart`;
      const response = await fetch(url);
      if (!response.ok) {
        if (response.status === 404 && cartId) {
          console.warn(
            `Cart ID ${cartId} not found on backend. Creating new cart.`
          );
          localStorage.removeItem("cartId");
          return getOrCreateCart();
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setCartId(data.id);
      localStorage.setItem("cartId", data.id);
      setCartDetails(data);
      showMessage(`Cart ready! ID: ${data.id}`, "success");
    } catch (error) {
      console.error("Error getting/creating cart:", error);
      showMessage(`Failed to get/create cart: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, [cartId]);

  const handleAddToCart = async (productId, quantity = 1) => {
    setIsLoading(true);
    try {
      if (!cartId) {
        showMessage("Please get a cart first!", "error");
        return;
      }
      const response = await fetch(`${API_BASE_URL}/cart/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartId, productId, quantity }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setCartDetails(data);
      showMessage(
        `${quantity} of ${
          products.find((p) => p.id === productId)?.name || productId
        } added to cart!`,
        "success"
      );
    } catch (error) {
      console.error("Error adding to cart:", error);
      showMessage(`Failed to add item to cart: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);
    setOrderConfirmation(null);
    try {
      if (!cartId) {
        showMessage("No active cart found to checkout!", "error");
        return;
      }
      if (cartDetails && cartDetails.items.length === 0) {
        showMessage(
          "Your cart is empty. Please add items before checking out.",
          "error"
        );
        return;
      }

      const payload = { cartId };
      if (couponCode) {
        payload.couponCode = couponCode;
      }

      const response = await fetch(`${API_BASE_URL}/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }
      const data = await response.json();
      setOrderConfirmation(data.order);
      setCartDetails(null);
      localStorage.removeItem("cartId");
      setCartId(null);
      setCouponCode("");
      showMessage("Order placed successfully!", "success");
      fetchAdminMetrics();
    } catch (error) {
      console.error("Error during checkout:", error);
      showMessage(`Checkout failed: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminMetrics = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/metrics`);
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setAdminMetrics(data);
    } catch (error) {
      console.error("Error fetching admin metrics:", error);
      showMessage(`Failed to load admin metrics: ${error.message}`, "error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleGenerateCoupon = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/generate-discount-code`,
        {
          method: "POST",
        }
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }
      showMessage(`Admin: ${data.message} Code: ${data.couponCode}`, "success");
      fetchAdminMetrics();
    } catch (error) {
      console.error("Error generating coupon:", error);
      showMessage(
        `Admin: Failed to generate coupon: ${error.message}`,
        "error"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // --- Initial Load Effect ---
  useEffect(() => {
    fetchProducts();
    getOrCreateCart();
    fetchAdminMetrics();
  }, [fetchProducts, getOrCreateCart, fetchAdminMetrics]);

  const isCartEmpty = cartDetails && cartDetails.items.length === 0;

  return (
    <div className="container mx-auto p-4 md:flex md:space-x-8">
      <LoadingSpinner isLoading={isLoading} />
      <Message message={message} />

      <div className="md:w-2/3 space-y-6">
        <ProductList products={products} onAddToCart={handleAddToCart} />
        <Cart cartId={cartId} cartDetails={cartDetails} products={products} />
        <CheckoutForm
          couponCode={couponCode}
          setCouponCode={setCouponCode}
          onCheckout={handleCheckout}
          orderConfirmation={orderConfirmation}
          cartIsEmpty={isCartEmpty}
        />
      </div>

      <div className="md:w-1/3 mt-6 md:mt-0 space-y-6">
        <AdminMetrics
          adminMetrics={adminMetrics}
          onRefreshMetrics={fetchAdminMetrics}
          onGenerateCoupon={handleGenerateCoupon}
        />
      </div>
    </div>
  );
};

export default EcomPage;
