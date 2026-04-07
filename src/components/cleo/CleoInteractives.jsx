import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export const ChoiceGroup = ({ choices = [], onChoice }) => (
  <div className="flex flex-wrap gap-2 my-2">
    {choices.map((choice, i) => (
      <Button key={i} variant="outline" size="sm" onClick={() => onChoice?.(choice)}>
        {choice.label || choice}
      </Button>
    ))}
  </div>
);

export const ComparisonCard = ({ items = [], title }) => (
  <Card className="my-2">
    <CardContent className="pt-4">
      {title && <p className="font-medium text-sm mb-2">{title}</p>}
      {items.map((item, i) => (
        <div key={i} className="text-sm py-1 border-b last:border-0">{item.label || item}</div>
      ))}
    </CardContent>
  </Card>
);

export const RealityCheck = ({ title, content }) => (
  <Card className="my-2 border-amber-200 bg-amber-50">
    <CardContent className="pt-4">
      {title && <p className="font-medium text-sm mb-1">{title}</p>}
      <p className="text-sm text-slate-600">{content}</p>
    </CardContent>
  </Card>
);

export const RiskAlert = ({ risk }) => (
  <Card className="my-2 border-red-200 bg-red-50">
    <CardContent className="pt-4">
      <p className="text-sm text-red-700">{risk?.message || risk}</p>
    </CardContent>
  </Card>
);
