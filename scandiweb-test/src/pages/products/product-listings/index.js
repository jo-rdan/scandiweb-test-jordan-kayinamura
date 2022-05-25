import { Component } from "react";
import { withRouter } from "react-router-dom";
import { graphql } from "react-apollo";
import "./styles/index.css";
import { getProductsByCategoryQuery } from "../../../utils/queries/product-listing";
import { compose } from "redux";
import { connect } from "react-redux";
import { addToCart } from "../../../redux/actions/products-actions/productDescActions";
import { Link } from "react-router-dom";

class Products extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const {
      data: { category },
      selectedCategory,
      currencySymbol,
      addToCart,
    } = this.props;
    return (
      <>
        <div className="product-container">
          <div className="product-category">
            <p>{category?.name}</p>
          </div>
          <div className="product-listing">
            {category?.products.map((product) => (
              <div
                className={`product-card ${
                  !product.inStock ? "out-stock" : ""
                }`}
                key={product.id}
              >
                {!product.inStock ? (
                  <div className="product-stock">
                    <span>
                      <p>out of stock</p>
                    </span>
                  </div>
                ) : null}
                <div className="product">
                  <div>
                    <Link to={`/${selectedCategory}/product/${product.id}`}>
                      <img
                        src={product.gallery[0]}
                        alt=""
                        className="product-img"
                      />
                    </Link>
                    <span
                      className="cart-hover"
                      onClick={() =>
                        product.inStock
                          ? addToCart({
                              ...product,
                              selectedArgs: {
                                ...product.attributes.map((attr) => ({
                                  [attr.id]: attr.items[0].value,
                                })),
                              },
                              quantity: 1,
                            })
                          : null
                      }
                    >
                      <img src="./images/cart_hover.png" alt="" />
                    </span>
                  </div>
                  <div>
                    <div className="product-name">{`${product.brand} ${product.name}`}</div>
                    <div className="product-price">
                      {product.prices
                        .filter(
                          (price) => currencySymbol === price.currency.symbol
                        )
                        .map(
                          (price) =>
                            `${price.currency.symbol}${parseFloat(
                              price.amount
                            ).toFixed(2)}`
                        )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  selectedCategory: state.categoryToFilter.category,
  currencySymbol: state.currencySwitcher.symbol,
});

export default compose(
  connect(mapStateToProps, { addToCart }),
  graphql(getProductsByCategoryQuery, {
    name: "data",
    options: ({ selectedCategory }) => ({
      variables: { title: selectedCategory || "all" },
    }),
  })
)(withRouter(Products));
