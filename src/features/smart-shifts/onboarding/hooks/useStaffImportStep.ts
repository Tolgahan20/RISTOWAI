import { useState } from 'react';
import { ContractType, type StaffImportData, type StaffMember } from '../types';

interface UseStaffImportStepProps {
  onSave: (data: StaffImportData) => Promise<void>;
  initialData?: StaffImportData | null;
}

const INITIAL_MEMBER_STATE: Partial<StaffMember> = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  role: '',
  contractType: ContractType.FULL_TIME,
  weeklyContractHours: 40,
  hourlyRate: 0,
  codiceFiscale: '',
  birthDate: '',
  iban: '',
  ccnlLevel: '',
};

export const useStaffImportStep = ({
  onSave,
  initialData,
}: UseStaffImportStepProps) => {
  const [staff, setStaff] = useState<StaffMember[]>(initialData?.staff || []);
  const [editingMember, setEditingMember] = useState<Partial<StaffMember>>(
    INITIAL_MEMBER_STATE
  );

  const isValidMember = (member: Partial<StaffMember>): member is StaffMember => {
    return !!(member.firstName && member.lastName && member.role);
  };

  const handleAddMember = () => {
    if (!isValidMember(editingMember)) {
      return;
    }

    const newMember: StaffMember = {
      firstName: editingMember.firstName,
      lastName: editingMember.lastName,
      email: editingMember.email,
      phone: editingMember.phone,
      role: editingMember.role,
      contractType: editingMember.contractType || ContractType.FULL_TIME,
      weeklyContractHours: editingMember.weeklyContractHours || 40,
      hourlyRate: editingMember.hourlyRate || 0,
      codiceFiscale: editingMember.codiceFiscale,
      birthDate: editingMember.birthDate,
      iban: editingMember.iban,
      ccnlLevel: editingMember.ccnlLevel,
    };

    setStaff([...staff, newMember]);
    setEditingMember(INITIAL_MEMBER_STATE);
  };

  const handleRemoveMember = (index: number) => {
    setStaff(staff.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave({ staff });
  };

  const handleSkip = async () => {
    await onSave({ staff: [] });
  };

  return {
    staff,
    editingMember,
    setEditingMember,
    handleAddMember,
    handleRemoveMember,
    handleSubmit,
    handleSkip,
  };
};

