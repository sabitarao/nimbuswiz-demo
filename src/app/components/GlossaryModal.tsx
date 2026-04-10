import { X, HelpCircle, Info } from 'lucide-react';
import { useState } from 'react';

interface GlossaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const glossaryTerms = [
  {
    term: 'Stability Index',
    definition: 'System health score (0-100). Above 80 is stable. Below 60 needs attention soon.',
    example: 'nimbus-lion: 85/100 (stable)',
  },
  {
    term: 'Quirk',
    definition: 'Behavioral anomaly unique to your system. Most quirks auto-resolve during upgrades.',
    example: '1 quirk found and fixed automatically',
  },
  {
    term: 'Confidence Score',
    definition: 'How certain we are this upgrade will succeed. 90%+ is very safe. 75-89% is safe for most systems.',
    example: '87% confidence = safe to proceed',
  },
  {
    term: 'Profile',
    definition: 'Pre-configured upgrade bundle tailored to specific use cases.',
    example: 'Performance Upgrade, Extended Operation',
  },
  {
    term: 'Dry-Run',
    definition: 'Simulated upgrade in sandbox environment. No actual changes to your system.',
    example: 'Run simulation to preview impact',
  },
  {
    term: 'Rollback',
    definition: 'Automatic revert to previous version if upgrade fails or causes issues.',
    example: 'Auto-rollback in 3 min if problems detected',
  },
  {
    term: 'Fleet',
    definition: 'Collective term for all managed Nimbus systems in your organization.',
    example: 'Your fleet has 6 systems total',
  },
  {
    term: 'System',
    definition: 'Individual Nimbus instance (e.g., nimbus-lion, nimbus-dragon).',
    example: 'nimbus-lion system is healthy',
  },
  {
    term: 'Upgrade',
    definition: 'Version jump from one major release to another.',
    example: 'Nimbus2020 → Nimbus2024',
  },
  {
    term: 'Patch',
    definition: 'Security or bug fix within the same major version.',
    example: 'Apply 14 security patches',
  },
  {
    term: 'Responsiveness Score',
    definition: 'Measures system reaction times and throughput. Combines latency, queue depth, and processing speed.',
    example: 'Score of 79 = good performance',
  },
  {
    term: 'Network Interaction',
    definition: 'Quality of inter-system communication. Tracks packet loss, connection reliability, and mesh stability.',
    example: 'Score of 74 = acceptable connectivity',
  },
];

export default function GlossaryModal({ isOpen, onClose }: GlossaryModalProps) {
  const [searchTerm, setSearchTerm] = useState('');

  if (!isOpen) return null;

  const filteredTerms = glossaryTerms.filter(
    term =>
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in-0 duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-3xl max-h-[90vh] overflow-auto animate-in fade-in-0 zoom-in-95 duration-200">
        <div className="bg-white rounded-xl shadow-2xl mx-4">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <HelpCircle className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-semibold text-slate-900">Glossary</h2>
              </div>
              <p className="text-slate-600 text-sm">
                Key terms and concepts for NimbusWiz platform
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close glossary"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search */}
          <div className="p-4 border-b border-slate-200">
            <input
              type="text"
              placeholder="Search terms..."
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Terms List */}
          <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
            {filteredTerms.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-600">No terms match "{searchTerm}"</p>
              </div>
            ) : (
              filteredTerms.map((item, index) => (
                <div
                  key={index}
                  className="pb-6 border-b border-slate-100 last:border-0 last:pb-0"
                >
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">
                    {item.term}
                  </h3>
                  <p className="text-sm text-slate-700 mb-2">
                    {item.definition}
                  </p>
                  <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-blue-900 font-medium mb-0.5">Example:</p>
                      <p className="text-xs text-blue-700">{item.example}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-slate-200 bg-slate-50">
            <p className="text-xs text-slate-600">
              {filteredTerms.length} term{filteredTerms.length !== 1 ? 's' : ''} shown
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
            >
              Got It
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
