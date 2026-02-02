import { useState, useEffect } from 'react';
import { Mail, Phone, MapPin, Briefcase, FileText, CheckCircle, XCircle, Clock } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import ConfirmationDialog from './ConfirmationDialog';
import { Candidate } from '@/types';
import { apiService } from '@/services/api';
import { toast } from '@/utils/toast';

interface CandidateDetailsModalProps {
  candidate: Candidate;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface InterviewData {
  id: number;
  candidate_id: string;
  total_experience: string;
  relevant_experience: string;
  current_ctc: string;
  expected_ctc: string;
  notice_period: string;
  reason_for_change: string;
  created_at: string;
  updated_at: string;
}



export default function CandidateDetailsModal({
  candidate,
  isOpen,
  onClose,
  onUpdate,
}: CandidateDetailsModalProps) {
  const [currentCandidate, setCurrentCandidate] = useState(candidate);
  const [notes, setNotes] = useState(candidate.Notes || '');
  const [showConfirm, setShowConfirm] = useState(false);
  const [interviewData, setInterviewData] = useState<InterviewData | null>(null);
const [loadingInterview, setLoadingInterview] = useState(false);
const [interviewError, setInterviewError] = useState(false);

  const [pendingAction, setPendingAction] = useState<{
    status: 'YES' | 'NO' | 'PENDING';
    label: string;
  } | null>(null);

  useEffect(() => {
    setCurrentCandidate(candidate);
    setNotes(candidate.Notes || '');
  }, [candidate]);

  const handleStatusChange = (status: 'YES' | 'NO' | 'PENDING', label: string) => {
    setPendingAction({ status, label });
    setShowConfirm(true);
  };

  const confirmStatusChange = async () => {
    if (!pendingAction) return;

    try {
      await apiService.updateCandidateStatus(
        currentCandidate.id,
        pendingAction.status,
        undefined,
        notes
      );
      toast.success(`Candidate marked as ${pendingAction.label}`);
      onUpdate();
      onClose();
    } catch (error) {
      console.error('Failed to update candidate status:', error);
      toast.error('Failed to update candidate status');
    }
  };

  const handleSaveNotes = async () => {
    try {
      await apiService.updateCandidateStatus(
        currentCandidate.id,
        currentCandidate.Short_Listed,
        undefined,
        notes
      );
      toast.success('Notes saved successfully');
    } catch (error) {
      console.error('Failed to save notes:', error);
      toast.error('Failed to save notes');
    }
  };


  useEffect(() => {
  if (!isOpen || !currentCandidate?.id) return;

  const fetchInterviewData = async () => {
    setLoadingInterview(true);
    setInterviewError(false);

    try {
      const res = await fetch(
        'https://n8n.srv982383.hstgr.cloud/webhook/0167ef86-9b5b-4088-a6c5-e3e41737f650',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            id: currentCandidate.Email,
          }),
        }
      );

      if (!res.ok) throw new Error('Failed');

      const data = await res.json();
      setInterviewData(data);
    } catch (err) {
      console.error(err);
      setInterviewError(true);
      setInterviewData(null);
    } finally {
      setLoadingInterview(false);
    }
  };

  fetchInterviewData();
}, [isOpen, currentCandidate.id]);


  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} title="Candidate Details" size="lg">
        <div className="space-y-6">
          {/* Header with Status */}
          <div className="flex items-start justify-between pb-4 border-b border-gray-200">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">{currentCandidate.Full_Name}</h3>
              <p className="text-gray-600 mt-1">{currentCandidate.Position_Applied}</p>
            </div>
            <Badge status={currentCandidate.Short_Listed} />
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Mail className="text-primary-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Email</p>
                <p className="text-sm font-medium text-gray-900">{currentCandidate.Email}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Phone className="text-primary-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Phone</p>
                <p className="text-sm font-medium text-gray-900">{currentCandidate.Number}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <MapPin className="text-primary-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Location</p>
                <p className="text-sm font-medium text-gray-900">{currentCandidate.Location}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
              <Briefcase className="text-primary-600" size={20} />
              <div>
                <p className="text-xs text-gray-500">Position Applied</p>
                <p className="text-sm font-medium text-gray-900">
                  {currentCandidate.Position_Applied}
                </p>
              </div>
            </div>
          </div>

          {/* Reason */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <FileText className="text-primary-600" size={18} />
              <h4 className="font-semibold text-gray-900">Reason</h4>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                {currentCandidate.Reason}
              </p>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">HR Notes</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add your notes about this candidate..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
            />
            <button
              onClick={handleSaveNotes}
              className="mt-2 px-4 py-2 text-sm font-medium text-primary-600 hover:text-primary-700"
            >
              Save Notes
            </button>
          </div>
          {/* Interview Details */}
<div>
  <h4 className="font-semibold text-gray-900 mb-3">
    Interview Details
  </h4>

  {loadingInterview && (
    <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg">
      Loading interview data...
    </div>
  )}

  {!loadingInterview && (interviewError || !interviewData) && (
    <div className="p-4 text-sm text-gray-500 bg-gray-50 rounded-lg">
      No interview data available
    </div>
  )}

  {!loadingInterview && interviewData && (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Candidate ID</p>
        <p className="text-sm font-medium">{interviewData.candidate_id}</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Total Experience</p>
        <p className="text-sm font-medium">{interviewData.total_experience}</p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Relevant Experience</p>
        <p className="text-sm font-medium">
          {interviewData.relevant_experience}
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Current CTC</p>
        <p className="text-sm font-medium">
          ₹ {interviewData.current_ctc} LPA
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Expected CTC</p>
        <p className="text-sm font-medium">
          ₹ {interviewData.expected_ctc} LPA
        </p>
      </div>

      <div className="p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Notice Period</p>
        <p className="text-sm font-medium">
          {interviewData.notice_period}
        </p>
      </div>

      <div className="md:col-span-2 p-4 bg-gray-50 rounded-lg border">
        <p className="text-xs text-gray-500">Reason for Change</p>
        <p className="text-sm font-medium">
          {interviewData.reason_for_change}
        </p>
      </div>

      <div className="md:col-span-2 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-xs text-blue-600">Date of Interview</p>
        <p className="text-sm font-semibold text-blue-900">
          {new Date(interviewData.updated_at).toLocaleDateString()}
        </p>
      </div>
    </div>
  )}
</div>


          {/* Action Buttons */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-semibold text-gray-900 mb-3">Actions</h4>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => handleStatusChange('YES', 'Shortlisted')}
                className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
              >
                <CheckCircle size={18} />
                Mark as Shortlisted
              </button>
              <button
                onClick={() => handleStatusChange('NO', 'Rejected')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                <XCircle size={18} />
                Mark as Rejected
              </button>
              <button
                onClick={() => handleStatusChange('PENDING', 'Pending')}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
              >
                <Clock size={18} />
                Move to Pending
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmationDialog
        isOpen={showConfirm}
        onClose={() => {
          setShowConfirm(false);
          setPendingAction(null);
        }}
        onConfirm={confirmStatusChange}
        title="Confirm Status Change"
        message={`Are you sure you want to mark this candidate as ${pendingAction?.label}?`}
        confirmText="Confirm"
        variant="default"
      />
    </>
  );
}
