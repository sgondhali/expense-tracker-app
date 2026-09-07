# 💰 Expense Tracker App

A modern, mobile-friendly web application for tracking expenses across multiple devices with real-time synchronization.

## ✨ Features

### 📱 Core Functionality
- **Add Transactions**: Record expenses with detailed information
- **Auto-Calculate Markup**: Automatically compute markup amount and percentage
- **Payment Status Tracking**: Track payment status (Pending, Paid, Partial)

### 🔍 Search & Filter
- Search transactions by vendor name
- Filter by date/month
- Real-time search results

### 📊 Monthly Summary
- Total card payments
- Total actual bills
- Total markup earned
- Average markup percentage
- Card charges tracking
- Net markup calculation

### 💾 Data Management
- **Local Storage**: All data stored securely in browser
- **Backup**: Export complete backup as JSON
- **Restore**: Import previous backups
- **Sync**: Synchronize across devices

### 📤 Export Options
- **CSV Export**: For spreadsheet applications
- **Excel Export**: Ready-to-use Excel format
- **JSON Export**: For data portability

### 📱 Responsive Design
- Mobile-friendly interface
- Tablet optimized
- Desktop experience
- Touch-friendly buttons and inputs

## 🚀 Getting Started

### Usage
1. Open `index.html` in a web browser
2. Add your first transaction
3. Watch the auto-calculations happen
4. View your monthly summary
5. Export your data

### Browser Requirements
- Modern browser with localStorage support (Chrome, Firefox, Safari, Edge)
- JavaScript enabled

## 📝 Transaction Fields

| Field | Description | Auto-Calculated |
|-------|-------------|------------------|
| Vendor/Particular | Name of the vendor or item | ❌ |
| Date | Transaction date | ❌ |
| Card Payment | Amount paid using credit card | ❌ |
| Actual Bill | Original bill amount | ❌ |
| Markup Amount | Difference between card payment and actual bill | ✅ |
| Markup % | Percentage markup | ✅ |
| Card Charges | Card processing charges | ❌ |
| Net Markup | Markup minus card charges | ✅ |
| Payment Status | Current payment status | ❌ |

## 💡 Example

```
Card Payment: ₹2,000
Actual Bill: ₹1,200
Markup Amount: ₹800 (auto-calculated)
Markup %: 66.67% (auto-calculated)
Card Charges: ₹50
Net Markup: ₹750 (auto-calculated)
```

## 🔐 Data Storage

All data is stored locally in your browser using localStorage:
- No data is sent to external servers
- Data persists across browser sessions
- Export and backup for safety

## 🎯 Use Cases

- **Resellers**: Track markups on resold items
- **Retailers**: Manage credit card transactions
- **Freelancers**: Track business expenses
- **Personal Finance**: Monitor spending patterns

## 📱 Mobile Features

- ✅ Responsive design
- ✅ Touch-optimized buttons
- ✅ Mobile keyboard support
- ✅ Fast loading
- ✅ Offline functionality

## 🔄 Sync Across Devices

1. **Device 1**: Create backup
2. **Transfer**: Share the backup file
3. **Device 2**: Restore the backup
4. **Sync**: Click sync button to confirm

## 📊 Summary Dashboard

The summary tab provides:
- Monthly totals for all metrics
- Average markup percentage
- Detailed transaction breakdown
- Quick month selection

## 🛠️ Technologies Used

- HTML5
- CSS3 (Flexbox & Grid)
- Vanilla JavaScript
- LocalStorage API
- File API (for export/import)

## 📱 Browser Compatibility

| Browser | Support |
|---------|----------|
| Chrome | ✅ Latest |
| Firefox | ✅ Latest |
| Safari | ✅ Latest |
| Edge | ✅ Latest |
| Mobile Chrome | ✅ Yes |
| Mobile Safari | ✅ Yes |

## 🔄 Version

**v1.0** - Initial Release
- Core functionality
- Mobile responsive
- Export/Import features
- Real-time calculations

## 📞 Support

For issues or suggestions, please create an issue in the repository.

## 📄 License

Open source - Feel free to use and modify

---

**Made with ❤️ for expense tracking**
