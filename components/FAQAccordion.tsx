// components/FAQAccordion.tsx - Reusable FAQ Accordion Component
'use client';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  items: FAQItem[];
  className?: string;
}

export default function FAQAccordion({ items, className }: FAQAccordionProps) {
  if (!items || items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">No FAQs available at this time.</p>
      </div>
    );
  }

  return (
    <Accordion type="single" collapsible className={`w-full space-y-4 ${className || ''}`}>
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          value={`item-${index}`}
          className="border-gray-800 bg-gray-900/30 rounded-lg px-4 md:px-6"
        >
          <AccordionTrigger className="text-left text-white hover:text-gray-300 py-4 md:py-6 text-base md:text-lg font-semibold">
            {item.question}
          </AccordionTrigger>
          <AccordionContent className="text-gray-300 text-base md:text-lg leading-relaxed pb-4 md:pb-6">
            {item.answer}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}

