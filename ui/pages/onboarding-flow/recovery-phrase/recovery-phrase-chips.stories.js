import React, { useState } from 'react';
import RecoveryPhraseChips from './recovery-phrase-chips';

export default {
  title: 'Pages/OnboardingFlow/RecoveryPhrase/RecoveryPhraseChips',
  component: RecoveryPhraseChips,
  argTypes: {
    secretRecoveryPhrase: { control: 'array' },
    phraseRevealed: { control: 'boolean' },
    confirmPhase: { control: 'boolean' },
    setInputValue: { control: 'text' },
    inputValue: { control: 'text' },
    indicesToCheck: { control: 'array' },
    hiddenPhrase:{control:'text'}
  }
};

const Template = (args) => <RecoveryPhraseChips {...args} />;
export const Default = Template.bind({});
Default.args = {};

export const PhraseRevealed = Template.bind({});
PhraseRevealed.args = {
  phraseRevealed:true,
};

export const ConfirmPhase=() =>{
  
  return (
      <Template 
        confirmPhase={true}
        secretRecoveryPhrase={[
          "apple","banana","cherry",
          "date","elderberry",
          "fig", "grape",
          "honeydew", "kiwi",
          "lemon",  	"mango",	
          	"nectarine"
]}
        
indicesToCheck={[2,3,7]}

      />
    
)
};
ConfirmPhase.args={
confirmPhase:true

};
