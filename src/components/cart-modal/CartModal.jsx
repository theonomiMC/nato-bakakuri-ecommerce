import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom';
import { isHidden } from '../../redux/cart/cart.actions';
// import { filterPrice } from '../../utils';
import CartItem from '../cart-item/CartItem'
import classes from './modal.module.scss'

class CartModal extends Component {
    constructor(props) {
        super(props);
        this.ref = React.createRef();
        this.handleClickOutside = this.handleClickOutside.bind(this);
    }

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }
    handleClickOutside(event) {
        if (this.ref && !this.ref.current.contains(event.target)) {
            this.props.isHidden()
        }
    }

    render() {
        const cartItems = this.props.cartItems
        const currency = this.props.currency
        const counter = this.props.counter
        const sum = this.props.sum.toFixed(2)
        return (
            <div className={classes.modalBox}>
                <div className={classes.modal} ref={this.ref}>
                    {counter > 0 ? (
                        <>
                            <h3> My Bag, {counter} items</h3>
                            {cartItems.length > 0 && cartItems.map(item => <CartItem item={item} key={item.uid} />)}
                            <div className={classes.total} >
                                <p className={classes.amount}>Total:</p>
                                <p>{currency}{sum}</p>
                            </div>
                        </>) : <h3>bag is empty</h3>

                    }
                    <div className={classes['modal-btns']}>
                        <Link to={'/product-cart'}>
                            <button disabled={counter === 0} onClick={() => this.props.isHidden()}>view bag</button>
                        </Link>
                        <Link to='/checkout'>
                            <button className={classes.checkout}
                                onClick={() => this.props.isHidden()}
                                disabled={counter === 0}>
                                check out
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = ({ cart: { cartItems, currency } }) => ({
    cartItems,
    counter: cartItems.reduce((total, item) => total + item.quantity, 0),
    sum: cartItems.reduce((total, item) => total + item.prices.filter(el => el.currency.symbol === currency)[0]['amount'] * item.quantity, 0),
    currency
})
const mapDispatchToProps = dispatch => ({
    isHidden: () => dispatch(isHidden())
});
export default connect(mapStateToProps, mapDispatchToProps)(CartModal)