import { 
  monitorCertificate, 
  getCertificateInfo, 
  isCertificateExpiringSoon 
} from '../src/index.js';

const certPath = './certs/cert.pem';

// Get certificate information
console.log('📋 Certificate Information:');
const info = getCertificateInfo(certPath);
console.log(`   Subject: ${info.subject}`);
console.log(`   Issuer: ${info.issuer}`);
console.log(`   Valid From: ${info.validFrom.toISOString()}`);
console.log(`   Valid To: ${info.validTo.toISOString()}`);
console.log(`   Days Until Expiration: ${info.daysUntilExpiration}`);
console.log(`   Is Expired: ${info.isExpired}`);
console.log(`   Serial Number: ${info.serialNumber}`);

// Check if expiring soon
const expiringSoon = isCertificateExpiringSoon(certPath, 30);
console.log(`\n⚠️  Expiring within 30 days: ${expiringSoon}`);

// Start monitoring
console.log('\n🔍 Starting certificate monitoring...\n');
const monitor = monitorCertificate(certPath, {
  warningThreshold: 30,  // Warn 30 days before expiration
  criticalThreshold: 7,   // Critical alert 7 days before
  onWarning: (daysLeft) => {
    console.log(`⚠️  WARNING: Certificate expires in ${daysLeft} days`);
    // Send email notification, Slack message, etc.
    sendNotification('warning', daysLeft);
  },
  onCritical: (daysLeft) => {
    console.error(`🚨 CRITICAL: Certificate expires in ${daysLeft} days!`);
    // Send urgent alert, page on-call engineer, etc.
    sendNotification('critical', daysLeft);
  }
});

// Example notification function
function sendNotification(level, daysLeft) {
  // Implement your notification logic here
  // Examples:
  // - Send email
  // - Post to Slack
  // - Trigger PagerDuty alert
  // - Update monitoring dashboard
  console.log(`📧 Notification sent: ${level} - ${daysLeft} days remaining`);
}

// Manually check certificate status at any time
console.log('🔄 Manual check:');
monitor.check();

// Get updated info
console.log('\n📊 Updated Info:');
const updatedInfo = monitor.getInfo();
console.log(`   Days Until Expiration: ${updatedInfo.daysUntilExpiration}`);

// Stop monitoring when done (optional)
// monitor.stop();

console.log('\n✅ Monitoring active. Press Ctrl+C to stop.');
