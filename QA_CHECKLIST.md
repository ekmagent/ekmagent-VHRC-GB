# Quality Assurance Checklist

## Before Every Deployment

### 1. Dev Mode Testing
- [ ] Load page with `?dev=true`
- [ ] Complete form through consent
- [ ] Switch tabs/close browser
- [ ] Verify NO webhook fires in Make.com
- [ ] Check console shows dev mode logs only

### 2. Production Mode Testing  
- [ ] Load page without `?dev=true`
- [ ] Complete form through consent
- [ ] Trigger abandonment (close tab)
- [ ] Verify webhook DOES fire in Make.com
- [ ] Check data quality in webhook

### 3. Code Review Checklist
- [ ] All webhook calls have dev mode checks
- [ ] Console logs clearly indicate dev vs production
- [ ] Error handling exists for all network calls
- [ ] No hardcoded values that should be environment variables

### 4. Monitoring Setup
- [ ] Make.com alerts configured
- [ ] Webhook response time monitoring active
- [ ] Data quality checks in place
- [ ] Abandonment rate tracking enabled

### 5. Rollback Plan
- [ ] Previous working commit identified
- [ ] Rollback process tested
- [ ] Emergency contact list updated
- [ ] Monitoring dashboard bookmarked

## Monthly Reviews
- [ ] Review webhook success/failure rates
- [ ] Analyze form abandonment patterns  
- [ ] Check for new edge cases in user behavior
- [ ] Update tests for new scenarios discovered
