# Shopify UAE Delivery Validation

**Validation date:** August 23, 2026  
**Shop:** Valerie jewelry  
**Shopify domain:** `valerie-jewelry-vzkuj01z.myshopify.com`  
**Currency:** AED

The Shopify General shipping profile is configured for the **United Arab Emirates only**, using the two flat delivery options approved by the owner. Shopify natively supports multiple named flat rates within a shipping zone.[1]

| Delivery option | Live price | Active | Country coverage |
|---|---:|---|---|
| Same-day delivery | AED 15.00 | Yes | United Arab Emirates |
| Next-day delivery | AED 12.00 | Yes | United Arab Emirates |

The authoritative Shopify query reports exactly **one country**, **two active method definitions**, and **zero locations without rates**. The previous AED 25/free UAE methods and AED 70 international zone are absent.

| Safety invariant | Verified state |
|---|---:|
| Draft products | 55 |
| Published products | 0 |
| Exact AED price matches | 100 |
| Non-taxable variants | 100 |
| Shipping-required variants | 100 |
| Inventory-untracked variants | 100 |
| `DENY` inventory-policy variants | 100 |
| Catalog mismatches | 0 |

> **COD remains pending.** Shopify supports manual cash-on-delivery payments, but its native manual-payment configuration does not provide a payment-method-specific surcharge field.[2] The desired AED 5 COD fee is therefore not configured, and no payment method, app, plan, checkout customization, or operational workaround has been activated without separate owner approval.

The supporting machine-readable evidence is stored in `shopify-uae-delivery-profile.json` and `shopify-uae-delivery-update-result.json` in this directory.

## References

[1]: https://help.shopify.com/en/manual/fulfillment/setup/shipping-rates/setting-up-shipping-rates "Shopify Help Center — Setting up shipping zones and rates"
[2]: https://help.shopify.com/en/manual/payments/manual-payments "Shopify Help Center — Manual payment methods"
