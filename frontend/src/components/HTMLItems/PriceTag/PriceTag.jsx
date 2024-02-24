import './PriceTag.css'
function PriceTag({ price }){
  return <span className="price-tag-container"><span className="price-tag">${price}</span> <span>night</span></span>
}

export default PriceTag;
