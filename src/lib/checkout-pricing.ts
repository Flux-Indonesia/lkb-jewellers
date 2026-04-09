import Stripe from "stripe";
import {
  getHatPostageForCountry,
  hasHatShipping,
} from "@/lib/shipping";

export interface CheckoutItemInput {
  id: string;
  quantity: number;
}

export interface CheckoutProductRecord {
  id: string;
  name: string;
  price: number | string | null;
  image?: string | null;
  stock?: number | null;
  category?: string | null;
  tags?: string | null;
}

export interface CheckoutPricing {
  subtotalGbp: number;
  hatShippingRequired: boolean;
  shippingCountryRequired: boolean;
  selectedShippingCountry: string | null;
  postageGbp: number;
  deliveryType: "deliver" | "collect";
  shippingOptions: Array<{
    label: string;
    amountGbp: number;
  }>;
  orderItems: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  lineItems: Stripe.Checkout.SessionCreateParams.LineItem[];
}

function getImages(image?: string | null) {
  if (!image || typeof image !== "string") return [];

  try {
    const url = new URL(image);
    return url.protocol === "https:" ? [image] : [];
  } catch {
    return [];
  }
}

export function buildCheckoutPricing(
  items: CheckoutItemInput[],
  productMap: Map<string, CheckoutProductRecord>,
  shippingCountry?: string | null,
  deliveryType: "deliver" | "collect" = "deliver"
): CheckoutPricing {
  const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];
  const orderItems: CheckoutPricing["orderItems"] = [];
  let subtotalGbp = 0;

  for (const item of items) {
    const product = productMap.get(item.id);

    if (!product) {
      throw new Error(`Product not found: ${item.id}`);
    }

    const price = Number(product.price);
    if (!price || price <= 0) {
      throw new Error(`${product.name} is not available for purchase`);
    }

    if (typeof product.stock === "number" && product.stock < item.quantity) {
      throw new Error(
        product.stock === 0
          ? `${product.name} is out of stock`
          : `Only ${product.stock} of ${product.name} available`
      );
    }

    const name = String(product.name).slice(0, 250);
    const unitAmount = Math.round(price * 100);

    lineItems.push({
      price_data: {
        currency: "gbp",
        product_data: {
          name,
          images: getImages(product.image),
        },
        unit_amount: unitAmount,
      },
      quantity: item.quantity,
    });

    orderItems.push({
      id: item.id,
      name,
      price,
      quantity: item.quantity,
    });

    subtotalGbp += price * item.quantity;
  }

  const hatShippingRequired = hasHatShipping(
    items.map((item) => {
      const product = productMap.get(item.id);
      return {
        category: product?.category,
        name: product?.name,
        tags: product?.tags,
      };
    })
  );

  const normalizedShippingCountry = hatShippingRequired && deliveryType === "deliver"
    ? shippingCountry?.trim().toUpperCase() || null
    : null;
  const postageGbp = normalizedShippingCountry
    ? getHatPostageForCountry(normalizedShippingCountry)
    : 0;

  return {
    subtotalGbp,
    hatShippingRequired,
    shippingCountryRequired: hatShippingRequired && deliveryType === "deliver",
    selectedShippingCountry: normalizedShippingCountry,
    postageGbp,
    deliveryType,
    shippingOptions: hatShippingRequired && normalizedShippingCountry
      ? [
        {
          label: normalizedShippingCountry === "GB" ? "UK hat postage" : "International hat postage",
          amountGbp: postageGbp,
        },
      ]
      : [],
    orderItems,
    lineItems,
  };
}
