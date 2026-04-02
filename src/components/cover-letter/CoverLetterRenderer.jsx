import React from 'react';
import { CoverLetterTemplate1 } from './templates/CoverLetterTemplate1';
import { CoverLetterTemplate2 } from './templates/CoverLetterTemplate2';
import { CoverLetterTemplate3 } from './templates/CoverLetterTemplate3';
import { CoverLetterTemplate4 } from './templates/CoverLetterTemplate4';
import { CoverLetterTemplate5 } from './templates/CoverLetterTemplate5';
import { CoverLetterTemplate6 } from './templates/CoverLetterTemplate6';
import { CoverLetterTemplate7 } from './templates/CoverLetterTemplate7';
import { CoverLetterTemplate8 } from './templates/CoverLetterTemplate8';

const CoverLetterRenderer = ({ content, templateId = 'cl_template_1' }) => {
  switch (templateId) {
    case 'cl_template_2': return <CoverLetterTemplate2 content={content} />;
    case 'cl_template_3': return <CoverLetterTemplate3 content={content} />;
    case 'cl_template_4': return <CoverLetterTemplate4 content={content} />;
    case 'cl_template_5': return <CoverLetterTemplate5 content={content} />;
    case 'cl_template_6': return <CoverLetterTemplate6 content={content} />;
    case 'cl_template_7': return <CoverLetterTemplate7 content={content} />;
    case 'cl_template_8': return <CoverLetterTemplate8 content={content} />;
    case 'cl_template_1':
    default: return <CoverLetterTemplate1 content={content} />;
  }
};

export default CoverLetterRenderer;