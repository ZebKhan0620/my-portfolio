'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import {
  formatCurrency,
  formatList,
  formatDuration,
  formatDate,
  formatNumber,
  formatRelativeTime,
  formatPlural
} from '@/lib/i18n';

/**
 * Demonstrates all the i18n helper functions
 * Created for issue 69 - i18n helper functions
 */
export default function I18nHelperDemo() {
  const { locale } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(true);

  // Example data for demonstration
  const amount = 1234.56;
  const listItems = ['Apple', 'Banana', 'Orange', 'Grape'];
  const duration = 3 * 60 * 60 * 1000 + 25 * 60 * 1000 + 45 * 1000; // 3h 25m 45s
  const date = new Date();
  const pastDate = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // 2 days ago
  const futureDate = new Date(Date.now() + 4 * 60 * 60 * 1000); // 4 hours from now
  const items = 3;

  return (
    <div className="w-full">
      <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700/50 overflow-hidden">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full flex items-center justify-between p-3 text-white hover:bg-gray-700/60"
        >
          <span className="font-medium">Available I18n Helper Functions</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-5 w-5 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {isExpanded && (
          <div className="p-4 bg-gray-900/80 text-sm">
            <h3 className="font-medium text-emerald-400 mb-2">Current locale: {locale}</h3>
            
            <div className="space-y-4">
              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatCurrency:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>USD: {formatCurrency(amount, 'USD', locale)}</div>
                  <div>EUR: {formatCurrency(amount, 'EUR', locale)}</div>
                  <div>JPY: {formatCurrency(amount, 'JPY', locale)}</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatList:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>Conjunction: {formatList(listItems, locale, { type: 'conjunction' })}</div>
                  <div>Disjunction: {formatList(listItems, locale, { type: 'disjunction' })}</div>
                  <div>Short style: {formatList(listItems, locale, { style: 'short' })}</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatDuration:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>Default: {formatDuration(duration, locale)}</div>
                  <div>Short: {formatDuration(duration, locale, { style: 'short' })}</div>
                  <div>Custom: {formatDuration(duration, locale, { 
                    format: ['hours', 'minutes', 'seconds'],
                    separator: ' - ',
                    style: 'narrow'
                  })}</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatDate:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>Default: {formatDate(date, locale)}</div>
                  <div>Full: {formatDate(date, locale, { dateStyle: 'full' })}</div>
                  <div>Custom: {formatDate(date, locale, { 
                    year: 'numeric', month: 'long', day: 'numeric', 
                    hour: '2-digit', minute: '2-digit'
                  })}</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatNumber:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>Default: {formatNumber(123456.789, locale)}</div>
                  <div>Percent: {formatNumber(0.4567, locale, { style: 'percent' })}</div>
                  <div>Scientific: {formatNumber(123456.789, locale, { notation: 'scientific' })}</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatRelativeTime:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>Past: {formatRelativeTime(pastDate, locale)}</div>
                  <div>Future: {formatRelativeTime(futureDate, locale)}</div>
                </div>
              </div>

              <div className="border-t border-gray-700 pt-2">
                <h4 className="font-medium mb-1">formatPlural:</h4>
                <div className="bg-gray-800 p-2 rounded">
                  <div>{formatPlural(items, {
                    one: 'One item',
                    other: '# items',
                  }, locale)}</div>
                  <div>{formatPlural(1, {
                    one: 'One item',
                    other: '# items',
                  }, locale)}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
