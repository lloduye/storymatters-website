# PesaPal Integration Guide for Story Matters Website

## Overview

This document outlines the complete PesaPal payment integration for the Story Matters website, allowing donors to make secure donations using various payment methods supported by PesaPal.

## 🚀 Features

- **Secure Payment Processing**: Integrated with PesaPal's secure payment gateway
- **Multiple Payment Methods**: Supports mobile money, bank transfers, and card payments
- **Real-time Notifications**: Instant Payment Notifications (IPN) for payment status updates
- **User-friendly Interface**: Clean donation modal with form validation
- **Success Tracking**: Comprehensive success page with sharing options
- **Mobile Responsive**: Works seamlessly on all devices

## 🔑 PesaPal Credentials

**Current Configuration:**
- **Consumer Key**: `oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2`
- **Consumer Secret**: `K2C+Cp4AFy2XV/ancyeyfbZYbPs=`
- **Environment**: Demo/Sandbox (for testing)

**Production Setup:**
When ready for production, update the following in `src/services/pesapalService.js`:
```javascript
this.baseUrl = 'https://www.pesapal.com'; // Change from demo.pesapal.com
this.iframeUrl = 'https://www.pesapal.com/pesapaliframe3/PesapalIframe3';
```

## 📁 File Structure

```
src/
├── services/
│   └── pesapalService.js          # PesaPal API integration service
├── components/
│   └── DonationModal.js           # Donation form and payment modal
├── pages/
│   ├── Donate.js                  # Updated donation page
│   └── DonationSuccess.js         # Success page after donation
netlify/
└── functions/
    └── pesapal-ipn.js            # IPN handler for payment callbacks
```

## 🛠️ Installation & Setup

### 1. Install Dependencies
```bash
npm install crypto-js
```

### 2. Environment Variables
Add the following to your `.env.local` file:
```env
PESAPAL_CONSUMER_KEY=oi8kiBIenB6FYAVE7UoM4XQVV1NkFEQ2
PESAPAL_CONSUMER_SECRET=K2C+Cp4AFy2XV/ancyeyfbZYbPs=
PESAPAL_ENVIRONMENT=demo  # Change to 'production' when ready
```

### 3. Netlify Function Setup
The `pesapal-ipn.js` function is automatically deployed with your Netlify site. Ensure your `netlify.toml` includes:
```toml
[functions]
  directory = "netlify/functions"
```

## 🔄 How It Works

### 1. Donation Flow
1. **User Selection**: User selects donation amount or enters custom amount
2. **Form Submission**: User fills out donation form with personal details
3. **Payment Request**: System creates PesaPal payment request
4. **Payment Processing**: User is redirected to PesaPal payment gateway
5. **Payment Completion**: User completes payment on PesaPal
6. **Success Confirmation**: User sees success page and receives confirmation

### 2. Technical Flow
```
User → DonationModal → pesapalService.createPaymentRequest() → PesaPal API
                                                                    ↓
PesaPal → IPN Callback → netlify/functions/pesapal-ipn.js → Database Update
```

## 📱 Usage

### For Donors
1. Navigate to `/donate` page
2. Select donation amount or enter custom amount
3. Click "Donate" button
4. Fill out donation form
5. Complete payment on PesaPal
6. View success confirmation

### For Developers
```javascript
import pesapalService from '../services/pesapalService';

// Create payment request
const result = await pesapalService.createPaymentRequest({
  amount: 50.00,
  description: 'Donation to Story Matters',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@example.com',
  phone: '+1234567890'
});

// Check payment status
const status = await pesapalService.checkPaymentStatus(trackingId);
```

## 🔒 Security Features

- **OAuth 1.0 Authentication**: Secure API communication with PesaPal
- **HMAC-SHA1 Signatures**: Tamper-proof request verification
- **HTTPS Only**: All communications use encrypted connections
- **Input Validation**: Comprehensive form validation and sanitization
- **Error Handling**: Graceful error handling without exposing sensitive data

## 📊 Payment Methods Supported

PesaPal supports the following payment methods:
- **Mobile Money**: M-Pesa, Airtel Money, MTN Mobile Money
- **Bank Transfers**: Direct bank transfers
- **Card Payments**: Credit and debit cards
- **Digital Wallets**: Various digital payment solutions

## 🧪 Testing

### Sandbox Environment
- Use the demo credentials provided
- Test with small amounts
- Verify IPN callbacks work correctly
- Test all payment methods

### Test Scenarios
1. **Successful Payment**: Complete donation flow
2. **Failed Payment**: Test error handling
3. **Partial Payment**: Test incomplete transactions
4. **Network Issues**: Test connection failures
5. **Mobile Responsiveness**: Test on various devices

## 🚨 Error Handling

### Common Errors
- **Invalid Amount**: Amount must be greater than 0
- **Missing Email**: Email is required for donation
- **API Errors**: PesaPal service unavailable
- **Payment Failures**: User cancels or payment fails

### Error Recovery
- Clear error messages for users
- Automatic retry mechanisms
- Fallback payment options
- Customer support contact information

## 📈 Monitoring & Analytics

### Payment Tracking
- Order ID generation and tracking
- Payment status monitoring
- Success/failure rate analysis
- Donor behavior insights

### Logging
- Payment request logs
- IPN callback logs
- Error logging and monitoring
- Performance metrics

## 🔄 IPN (Instant Payment Notification)

### What is IPN?
IPN is a webhook that PesaPal sends to notify your system about payment status changes.

### IPN Endpoint
```
POST /api/pesapal/ipn
```

### IPN Data
- `pesapal_merchant_reference`: Your order reference
- `pesapal_notification_type`: Type of notification
- `pesapal_order_tracking_id`: PesaPal's tracking ID

### IPN Response
```xml
<?xml version="1.0" encoding="utf-8"?>
<pesapal_response xmlns="http://www.pesapal.com">
  <pesapal_response_code>OK</pesapal_response_code>
  <pesapal_response_description>IPN received successfully</pesapal_response_description>
</pesapal_response>
```

## 🚀 Deployment

### Netlify Deployment
1. Push changes to GitHub
2. Netlify automatically builds and deploys
3. Functions are deployed to `/.netlify/functions/`
4. Test IPN endpoint functionality

### Production Checklist
- [ ] Update PesaPal credentials to production
- [ ] Change base URLs from demo to production
- [ ] Test IPN endpoint thoroughly
- [ ] Verify payment processing works
- [ ] Monitor error logs
- [ ] Set up monitoring and alerts

## 📞 Support

### PesaPal Support
- **Documentation**: [PesaPal Developer Docs](https://developer.pesapal.com)
- **Support Email**: developer@pesapal.com
- **Phone**: +254 20 518 0000

### Technical Issues
- Check browser console for errors
- Verify Netlify function logs
- Test IPN endpoint manually
- Review PesaPal API documentation

## 🔮 Future Enhancements

### Planned Features
- **Recurring Donations**: Monthly/yearly subscription support
- **Donor Dashboard**: Personal donation history and impact
- **Email Notifications**: Automated thank you and update emails
- **Analytics Dashboard**: Donation trends and insights
- **Multi-currency**: Support for different currencies
- **Social Sharing**: Enhanced social media integration

### Integration Possibilities
- **CRM Integration**: Connect with donor management systems
- **Accounting Software**: Sync with financial systems
- **Marketing Tools**: Email marketing and automation
- **Analytics Platforms**: Google Analytics, Facebook Pixel

## 📝 Changelog

### Version 1.0.0 (Current)
- Initial PesaPal integration
- Basic donation flow
- IPN handling
- Success page
- Mobile responsive design

## 🤝 Contributing

When making changes to the PesaPal integration:
1. Test thoroughly in sandbox environment
2. Update documentation
3. Follow security best practices
4. Test error scenarios
5. Verify mobile responsiveness

## 📄 License

This integration is part of the Story Matters website project. Please refer to the main project license for usage terms.

---

**Last Updated**: January 2025
**Version**: 1.0.0
**Status**: Production Ready (Sandbox)
