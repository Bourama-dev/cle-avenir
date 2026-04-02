import React from 'react';
import { CVTemplate1 } from './templates/CVTemplate1';
import { CVTemplate2 } from './templates/CVTemplate2';
import { CVTemplate3 } from './templates/CVTemplate3';
import { CVTemplate4 } from './templates/CVTemplate4';
import { CVTemplate5 } from './templates/CVTemplate5';
import { CVTemplate6 } from './templates/CVTemplate6';
import { CVTemplate7 } from './templates/CVTemplate7';
import { CVTemplate8 } from './templates/CVTemplate8';
import { TEMPLATE_UUIDS } from '@/data/cvTemplateConfig';
import { CVErrorBoundary } from './CVErrorBoundary';
import CVTemplateWrapper from './CVTemplateWrapper';
import { normalizeCVData } from '@/utils/cvDataNormalizer';

const CVTemplate = ({ data, templateName }) => {
  // Normalize the CV data centrally before passing it to the templates
  const normalizedData = normalizeCVData(data);

  // Fallback to default template UUID if none provided or invalid
  const templateId = templateName || TEMPLATE_UUIDS.template1;

  let SelectedTemplate = CVTemplate1;

  switch (templateId) {
    case TEMPLATE_UUIDS.template2: SelectedTemplate = CVTemplate2; break;
    case TEMPLATE_UUIDS.template3: SelectedTemplate = CVTemplate3; break;
    case TEMPLATE_UUIDS.template4: SelectedTemplate = CVTemplate4; break;
    case TEMPLATE_UUIDS.template5: SelectedTemplate = CVTemplate5; break;
    case TEMPLATE_UUIDS.template6: SelectedTemplate = CVTemplate6; break;
    case TEMPLATE_UUIDS.template7: SelectedTemplate = CVTemplate7; break;
    case TEMPLATE_UUIDS.template8: SelectedTemplate = CVTemplate8; break;
    case TEMPLATE_UUIDS.template1:
    default: SelectedTemplate = CVTemplate1; break;
  }

  if (!SelectedTemplate) {
    console.error(`[CVTemplate] Failed to load template component for ID: ${templateId}`);
    return (
      <div className="p-8 text-center bg-red-50 text-red-600 rounded-lg border border-red-200">
        Le modèle sélectionné n'a pas pu être chargé.
      </div>
    );
  }

  return (
    <CVErrorBoundary>
      <CVTemplateWrapper template={SelectedTemplate} cvData={normalizedData} />
    </CVErrorBoundary>
  );
};

export default CVTemplate;