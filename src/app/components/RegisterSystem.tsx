import { useState } from 'react';
import { X, Server, AlertCircle, CheckCircle, Sparkles } from 'lucide-react';
import { useAnalytics } from '../contexts/AnalyticsContext';
import { useToast } from '../contexts/ToastContext';
import { useNavigate } from 'react-router';

interface RegisterSystemProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RegisterSystem({ isOpen, onClose }: RegisterSystemProps) {
  const { trackEvent } = useAnalytics();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    systemName: '',
    serialNumber: '',
    currentVersion: 'Nimbus2000',
    manufacturingYear: '',
    flightHours: '',
    maxVelocity: '',
    handlingScore: '',
    acceleration: '',
    usageType: 'racing',
    location: '',
    status: 'active',
    lastServiceDate: '',
    nextServiceDue: '',
    serviceHistory: '',
    safetyCertification: 'valid',
    knownIssues: '',
    compatibility: '',
    description: '',
    enableMonitoring: true,
    enableAutoUpdates: false,
  });

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isValidating, setIsValidating] = useState(false);
  const [validationSuccess, setValidationSuccess] = useState(false);

  if (!isOpen) return null;

  const handleInputChange = (field: string, value: any) => {
    setFormData({ ...formData, [field]: value });
    // Clear validation error when user types
    if (validationErrors[field]) {
      setValidationErrors({ ...validationErrors, [field]: '' });
    }
  };

  const validateStep1 = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.systemName.trim()) {
      errors.systemName = 'System name is required';
    } else if (!/^nimbus-/.test(formData.systemName)) {
      errors.systemName = 'System name must start with "nimbus-"';
    }

    if (!formData.serialNumber.trim()) {
      errors.serialNumber = 'Serial number is required';
    }

    if (!formData.manufacturingYear.trim()) {
      errors.manufacturingYear = 'Manufacturing year is required';
    } else if (isNaN(parseInt(formData.manufacturingYear)) || parseInt(formData.manufacturingYear) < 1900 || parseInt(formData.manufacturingYear) > 2026) {
      errors.manufacturingYear = 'Please enter a valid year between 1900 and 2026';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const validateStep2 = () => {
    const errors: Record<string, string> = {};

    if (formData.maxVelocity && (isNaN(parseInt(formData.maxVelocity)) || parseInt(formData.maxVelocity) < 0 || parseInt(formData.maxVelocity) > 100)) {
      errors.maxVelocity = 'Max velocity must be between 0 and 100';
    }

    if (formData.handlingScore && (isNaN(parseInt(formData.handlingScore)) || parseInt(formData.handlingScore) < 0 || parseInt(formData.handlingScore) > 100)) {
      errors.handlingScore = 'Handling score must be between 0 and 100';
    }

    if (formData.flightHours && isNaN(parseInt(formData.flightHours))) {
      errors.flightHours = 'Flight hours must be a valid number';
    }

    if (formData.serviceHistory && isNaN(parseInt(formData.serviceHistory))) {
      errors.serviceHistory = 'Service history must be a valid number';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleValidateSystem = async () => {
    if (!validateStep1()) return;
    if (!validateStep2()) return;

    setIsValidating(true);
    trackEvent('system_validation_started', {
      system_name: formData.systemName,
    });

    // Simulate system validation
    setTimeout(() => {
      setIsValidating(false);
      setValidationSuccess(true);
      trackEvent('system_validation_success', {
        system_name: formData.systemName,
      });
      showToast('success', 'System validation successful!');
    }, 2000);
  };

  const handleRegister = () => {
    trackEvent('system_registered', {
      system_name: formData.systemName,
      usage_type: formData.usageType,
      status: formData.status,
      monitoring_enabled: formData.enableMonitoring,
      auto_updates_enabled: formData.enableAutoUpdates,
    });

    showToast('success', `System "${formData.systemName}" registered successfully! Running initial scan...`);
    onClose();
    
    // Navigate to the system detail page (using a mock ID for demo)
    setTimeout(() => {
      navigate('/systems/nimbus-new-system');
    }, 500);
  };

  const renderStep1 = () => (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">
          System ID <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="nimbus-phoenix"
          className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            validationErrors.systemName ? 'border-red-300 bg-red-50' : 'border-slate-300'
          }`}
          value={formData.systemName}
          onChange={(e) => handleInputChange('systemName', e.target.value)}
          aria-invalid={!!validationErrors.systemName}
          aria-describedby={validationErrors.systemName ? 'systemName-error' : undefined}
        />
        {validationErrors.systemName && (
          <p id="systemName-error" className="text-xs text-red-600 mt-1 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            {validationErrors.systemName}
          </p>
        )}
        <p className="text-xs text-slate-500 mt-1">Must start with "nimbus-" (e.g., nimbus-lion, nimbus-phoenix)</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Serial Number <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="NMB-2000-4782"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.serialNumber ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            value={formData.serialNumber}
            onChange={(e) => handleInputChange('serialNumber', e.target.value)}
            aria-invalid={!!validationErrors.serialNumber}
          />
          {validationErrors.serialNumber && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.serialNumber}
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Manufacturing Year <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            placeholder="2000"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.manufacturingYear ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            value={formData.manufacturingYear}
            onChange={(e) => handleInputChange('manufacturingYear', e.target.value)}
            aria-invalid={!!validationErrors.manufacturingYear}
          />
          {validationErrors.manufacturingYear && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.manufacturingYear}
            </p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Current Version <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.currentVersion}
            onChange={(e) => handleInputChange('currentVersion', e.target.value)}
          >
            <option value="Nimbus1500">Nimbus1500</option>
            <option value="Nimbus2000">Nimbus2000</option>
            <option value="Nimbus2001">Nimbus2001</option>
            <option value="Nimbus2020">Nimbus2020</option>
            <option value="Nimbus2021">Nimbus2021</option>
            <option value="Nimbus2022">Nimbus2022</option>
            <option value="Nimbus2024">Nimbus2024</option>
            <option value="Nimbus2025">Nimbus2025</option>
            <option value="Nimbus2026">Nimbus2026</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Location
          </label>
          <input
            type="text"
            placeholder="Facility A, Storage Room 3"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Usage Type <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.usageType}
            onChange={(e) => handleInputChange('usageType', e.target.value)}
          >
            <option value="racing">Racing</option>
            <option value="training">Training</option>
            <option value="transport">Transport</option>
            <option value="display">Display/Retired</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Status <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.status}
            onChange={(e) => handleInputChange('status', e.target.value)}
          >
            <option value="active">Active</option>
            <option value="maintenance">In Maintenance</option>
            <option value="retired">Retired</option>
            <option value="reserve">Reserve</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
        <textarea
          placeholder="Brief description of this system's purpose..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={3}
          value={formData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Performance & Service Metrics</h3>
            <p className="text-xs text-blue-700">
              These metrics help determine upgrade eligibility and system health monitoring.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Flight Hours
          </label>
          <input
            type="text"
            placeholder="1,500"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.flightHours ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            value={formData.flightHours}
            onChange={(e) => handleInputChange('flightHours', e.target.value)}
            aria-invalid={!!validationErrors.flightHours}
          />
          {validationErrors.flightHours && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.flightHours}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">Total operational hours</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Max Velocity
          </label>
          <input
            type="text"
            placeholder="85"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.maxVelocity ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            value={formData.maxVelocity}
            onChange={(e) => handleInputChange('maxVelocity', e.target.value)}
            aria-invalid={!!validationErrors.maxVelocity}
          />
          {validationErrors.maxVelocity && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.maxVelocity}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">Scale 0-100</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Handling Score
          </label>
          <input
            type="text"
            placeholder="72"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.handlingScore ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            value={formData.handlingScore}
            onChange={(e) => handleInputChange('handlingScore', e.target.value)}
            aria-invalid={!!validationErrors.handlingScore}
          />
          {validationErrors.handlingScore && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.handlingScore}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">Maneuverability rating (0-100)</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Acceleration
          </label>
          <input
            type="text"
            placeholder="Fast, Medium, Slow"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.acceleration}
            onChange={(e) => handleInputChange('acceleration', e.target.value)}
          />
          <p className="text-xs text-slate-500 mt-1">How quickly it reaches top speed</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Last Service Date
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.lastServiceDate}
            onChange={(e) => handleInputChange('lastServiceDate', e.target.value)}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Next Service Due
          </label>
          <input
            type="date"
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.nextServiceDue}
            onChange={(e) => handleInputChange('nextServiceDue', e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Service History
          </label>
          <input
            type="text"
            placeholder="5"
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              validationErrors.serviceHistory ? 'border-red-300 bg-red-50' : 'border-slate-300'
            }`}
            value={formData.serviceHistory}
            onChange={(e) => handleInputChange('serviceHistory', e.target.value)}
            aria-invalid={!!validationErrors.serviceHistory}
          />
          {validationErrors.serviceHistory && (
            <p className="text-xs text-red-600 mt-1 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              {validationErrors.serviceHistory}
            </p>
          )}
          <p className="text-xs text-slate-500 mt-1">Number of repairs/overhauls</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Safety Certification <span className="text-red-500">*</span>
          </label>
          <select
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.safetyCertification}
            onChange={(e) => handleInputChange('safetyCertification', e.target.value)}
          >
            <option value="valid">Valid</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Known Issues</label>
        <textarea
          placeholder="Any active defects or concerns..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          value={formData.knownIssues}
          onChange={(e) => handleInputChange('knownIssues', e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1">Compatibility</label>
        <textarea
          placeholder="Which upgrades this system can accept..."
          className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={2}
          value={formData.compatibility}
          onChange={(e) => handleInputChange('compatibility', e.target.value)}
        />
        <p className="text-xs text-slate-500 mt-1">Supported upgrade paths or compatible enhancements</p>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <button
          onClick={handleValidateSystem}
          disabled={isValidating || validationSuccess}
          className={`w-full flex items-center justify-center gap-2 px-4 py-2 border rounded-lg transition-colors ${
            validationSuccess
              ? 'bg-green-50 border-green-300 text-green-700'
              : isValidating
              ? 'bg-slate-50 border-slate-300 text-slate-400 cursor-not-allowed'
              : 'border-slate-300 text-slate-700 hover:bg-slate-50'
          }`}
        >
          {isValidating ? (
            <>
              <div className="w-4 h-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin" />
              Validating System...
            </>
          ) : validationSuccess ? (
            <>
              <CheckCircle className="w-5 h-5" />
              Validation Successful
            </>
          ) : (
            <>
              <Server className="w-5 h-5" />
              Validate System
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-blue-600 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-blue-900 mb-1">Configure Monitoring & Automation</h3>
            <p className="text-xs text-blue-700">
              These settings help NimbusWiz provide intelligent recommendations and keep your system healthy.
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        <label className="flex items-start gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
          <input
            type="checkbox"
            checked={formData.enableMonitoring}
            onChange={(e) => handleInputChange('enableMonitoring', e.target.checked)}
            className="mt-0.5 text-blue-600"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">Enable Real-Time Monitoring</div>
            <div className="text-xs text-slate-600 mt-1">
              Track stability, performance, and metrics continuously. Required for predictive insights.
            </div>
          </div>
        </label>

        <label className="flex items-start gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
          <input
            type="checkbox"
            checked={formData.enableAutoUpdates}
            onChange={(e) => handleInputChange('enableAutoUpdates', e.target.checked)}
            className="mt-0.5 text-blue-600"
          />
          <div className="flex-1">
            <div className="text-sm font-medium text-slate-900">Enable Auto-Apply for Safe Upgrades</div>
            <div className="text-xs text-slate-600 mt-1">
              Automatically apply upgrades with 90%+ confidence scores. You'll receive notifications before changes.
            </div>
          </div>
        </label>
      </div>

      <div className="pt-4 border-t border-slate-200">
        <h3 className="text-sm font-medium text-slate-700 mb-3">Review Registration Details</h3>
        <div className="bg-slate-50 rounded-lg p-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-600">System ID:</span>
            <span className="font-medium text-slate-900">{formData.systemName || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Serial Number:</span>
            <span className="font-medium text-slate-900">{formData.serialNumber || 'Not set'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Version:</span>
            <span className="font-medium text-slate-900">{formData.currentVersion}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Usage Type:</span>
            <span className="font-medium text-slate-900 capitalize">{formData.usageType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Status:</span>
            <span className="font-medium text-slate-900 capitalize">{formData.status}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-600">Monitoring:</span>
            <span className="font-medium text-slate-900">{formData.enableMonitoring ? 'Enabled' : 'Disabled'}</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
              <Server className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Register New System</h2>
              <p className="text-sm text-slate-600">Add a Nimbus system to your fleet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-slate-200">
          <div className="flex items-center justify-between">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center flex-1">
                <div className="flex items-center gap-2">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step > stepNum
                        ? 'bg-green-500 text-white'
                        : step === stepNum
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {step > stepNum ? '✓' : stepNum}
                  </div>
                  <span
                    className={`text-sm ${
                      step >= stepNum ? 'text-slate-900 font-medium' : 'text-slate-500'
                    }`}
                  >
                    {stepNum === 1 && 'System Info'}
                    {stepNum === 2 && 'Performance'}
                    {stepNum === 3 && 'Configure'}
                  </span>
                </div>
                {stepNum < 3 && <div className="flex-1 h-0.5 bg-slate-200 mx-2" />}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 py-6">
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={() => {
              if (step === 1) {
                onClose();
              } else {
                setStep(step - 1);
                setValidationSuccess(false);
              }
            }}
            className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            {step === 1 ? 'Cancel' : 'Back'}
          </button>

          <div className="flex items-center gap-2">
            {step < 3 ? (
              <button
                onClick={() => {
                  if (step === 1 && validateStep1()) {
                    setStep(2);
                  } else if (step === 2 && validateStep2()) {
                    setStep(3);
                  }
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleRegister}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
              >
                <CheckCircle className="w-5 h-5" />
                Register System
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}