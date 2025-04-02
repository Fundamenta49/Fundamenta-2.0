import React from 'react';
import CreditBuildingSkillsEnhanced from './credit-building-skills-enhanced';

// This is a connector component that imports and re-exports the enhanced
// credit building skills component for ease of integration with the existing app
export const CreditSkills: React.FC = () => {
  return <CreditBuildingSkillsEnhanced />;
};

export default CreditSkills;