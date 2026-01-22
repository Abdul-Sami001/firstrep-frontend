# API Client Transformation Guide

## Important: All API Responses Are Automatically Transformed

**CRITICAL**: The API client (`src/lib/api/client.ts`) automatically transforms ALL API responses from snake_case to camelCase.

### How It Works

1. **Response Interceptor** (lines 68-82 in `client.ts`):
   ```typescript
   if (response.config.skipTransformResponse !== true && response.data) {
       response.data = transformToCamelCase(response.data);
   }
   ```

2. **Applies to Both Clients**:
   - `apiClient` (regular API)
   - `adminApiClient` (admin API)

3. **Recursive Transformation**:
   - Transforms nested objects
   - Transforms arrays
   - Transforms all keys recursively

### Transformation Rules

- `snake_case` → `camelCase`
- `reseller__company_name` → `reseller_CompanyName` (double underscores become single underscore + capital)
- `commission_amount` → `commissionAmount`
- `orders_count` → `ordersCount`

### Best Practices for Adapters

**✅ DO:**
- Check camelCase fields FIRST
- Use fallback to snake_case for backward compatibility
- Example: `data.commissionAmount || data.commission_amount`

**❌ DON'T:**
- Assume responses are in snake_case
- Only check snake_case fields
- Call `transformToCamelCase()` again (already done by client)

### Example

```typescript
// ✅ CORRECT - Check camelCase first
const commission = data.commissionAmount || data.commission_amount || 0;

// ❌ WRONG - Only checking snake_case
const commission = data.commission_amount || 0;
```

### Special Cases

Some endpoints may use `skipTransformResponse: true` to skip transformation:
- Image responses
- Binary data
- Redirects

Check the API call configuration if transformation seems missing.
