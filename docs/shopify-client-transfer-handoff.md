# Shopify Client-Transfer Handoff Guide

**Prepared by:** Manus AI  
**Verification date:** August 23, 2026  
**Partner organization:** Valerie Jewelry, organization ID `227537033`  
**Partner organization number:** `5063150`  
**Store:** Valerie jewelry  
**Shopify domain:** `valerie-jewelry-vzkuj01z.myshopify.com`

## Verified handoff readiness

The Shopify Dev Dashboard lists this store under **Client transfer**, with status **In development**, owner **Valerie Jewelry**, plan **Client transfer**, and creation date **August 19, 2026**. The store row’s Actions menu exposes **Transfer store**, confirming that the store is eligible for a client handoff. No transfer has been initiated.

| Readiness field | Verified value |
|---|---|
| Store type | Client transfer |
| Current status | In development |
| Transfer action available | Yes |
| Transfer invitation sent | No |
| Paid plan selected | No |
| Billing changed | No |
| Shopify payment products activated | No changes made during this project |
| Products published | No; all 55 remain draft |

Shopify states that a Partner owns and configures a client-transfer store during the build phase and transfers ownership when the client is ready to go live. After acceptance, the merchant takes full ownership and the store leaves the Partner organization; collaborator access is retained by default.[1]

## Owner-approved transfer sequence

The transfer must remain gated until the owner approves handoff and launch preparation. At that point, the Partner opens the Dev Dashboard, selects the store’s three-dot Actions menu, chooses **Transfer store**, enters the approved client email address, and submits the transfer. Shopify then emails the recipient an invitation.[1]

> A pending transfer expires after **seven days** if the client does not accept it. If it expires, the Partner must send a new transfer invitation.[1]

The recipient accepts the transfer from Shopify’s email and selects a Shopify plan. Shopify does not allow the Partner to change a client-transfer store’s plan before handoff; the client chooses the plan when receiving the transfer.[1]

| Handoff step | Responsible party | Current approval state |
|---|---|---|
| Confirm final recipient email | Owner | Pending final handoff approval |
| Confirm billing currency and business address | Owner / Partner | Pending final handoff review |
| Check that no Shopify financial products block transfer | Partner | Must be rechecked immediately before transfer |
| Select **Transfer store** and send invitation | Partner | Not authorized yet |
| Accept invitation and choose paid plan | Owner | Not started |
| Review retained collaborator access | Owner | After transfer |
| Publish products, remove storefront password, connect domain, and activate payments | Owner / Partner | Separately gated launch actions |

## Important pre-transfer limitations

While the store remains in the Partner organization, real transactions are not supported, the online store stays password-protected, functional shipping labels are unavailable, and only free or partner-friendly apps can be installed.[1] [2] These restrictions explain why real checkout and payment validation cannot be completed before the owner accepts the transfer and selects a plan.

Shopify also states that a store with active Shopify financial products cannot be transferred. Immediately before handoff, verify that Shopify Payments, Shopify Balance, Shopify Credit, and Shopify Capital are not active.[1]

No transfer, billing, plan, payment, domain, product-publication, or launch action should be performed without the owner’s explicit approval at that milestone.

## References

[1]: https://shopify.dev/docs/apps/build/dev-dashboard/stores/client-transfer-stores "Shopify Developer Documentation — Client transfer stores"
[2]: https://help.shopify.com/en/partners/manage-clients-stores/client-transfer-stores "Shopify Help Center — Client transfer stores and collaborations"
