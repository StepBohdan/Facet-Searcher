import type { Product } from "../../api/products";

export default function ProductCard({key, product}: {key: string, product: Product} ) {
  return (
    <div key={key} className="card">
      <div className="card__imgWrap">
        {product.image ? (
          <img className="card__img" src={product.image} alt={product.name} />
        ) : (
          <div className="card__imgPlaceholder">No image</div>
        )}
      </div>
      <div className="card__body">
        <div className="card__title" title={product.name}>
          {product.name}
        </div>
        <div className="card__brand">{product.brand}</div>
      </div>
    </div>
  );
}