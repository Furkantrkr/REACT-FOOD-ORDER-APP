import { useContext } from 'react';
import styles from './Checkout.module.css';
import CartContext from '../../store/CartContext';
import { currencyFormatter } from '../../util/formatting';
import Button from '../UI/Button';
import UserProgressContext from '../../store/UserProgressContext';
import Modal from '../Modal/Modal';
import Input from '../UI/Input';

export default function Checkout() {
  const cartCtx = useContext(CartContext);
  const userProgressCtx = useContext(UserProgressContext);

  const cartTotal = cartCtx.items.reduce(
    (totalPrice, item) => totalPrice + item.price * item.quantity,
    0
  );

  function handleClose() {
    userProgressCtx.hideCheckout();
  }

  function handleSubmit(event) {
    event.preventDefault();

    const fd = new FormData(event.target);
    const customerData = Object.fromEntries(fd.entries()); // {email: test@example.com, ...}

    async function sendOrders(order) {
      const response = await fetch('http://localhost:3000/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          order: {
            items: cartCtx.items,
            customer: customerData,
          },
        }),
      });
    }

    sendOrders(customerData);
  }

  return (
    <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
      <form onSubmit={handleSubmit}>
        <h2>Checkout</h2>
        <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>
        <Input label="Full Name" type="text" id="name" />
        <Input label="Email Adress" type="email" id="email" />
        <Input label="street" type="text" id="street" />
        <div className={styles['control-row']}>
          <Input label="Postal Code" type="text" id="postal-code" />
          <Input label="City" type="text" id="city" />
        </div>
        <p className={styles['modal-actions']}>
          <Button onClick={handleClose} type="button" textOnly>
            Close
          </Button>
          <Button>Submit Order</Button>
        </p>
      </form>
    </Modal>
  );
}
