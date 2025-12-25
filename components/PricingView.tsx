
import React from 'react';
import { TranslationDictionary, UserTier } from '../types';
import { CheckCircleIcon, StarIcon } from './Icons';
import { TIER_LIMITS } from '../constants';

interface PricingViewProps {
  t: TranslationDictionary;
  currentTier: UserTier;
  onUpgrade: (tier: UserTier) => void;
  onContactUs: () => void;
}

const PricingCard: React.FC<{
  tier: UserTier;
  title: string;
  price: string;
  features: string[];
  isCurrent: boolean;
  onAction: () => void;
  actionLabel: string;
  isPopular?: boolean;
}> = ({ tier, title, price, features, isCurrent, onAction, actionLabel, isPopular }) => {
  return (
    <div className={`relative bg-white rounded-2xl shadow-lg border p-6 flex flex-col h-full ${isCurrent ? 'border-green-500 ring-1 ring-green-500' : 'border-gray-200'}`}>
      {isPopular && (
        <div className="absolute top-0 right-0 transform translate-x-2 -translate-y-2">
          <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm uppercase tracking-wider">
            Popular
          </span>
        </div>
      )}
      
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
        <div className="mt-2 flex items-baseline">
          <span className="text-3xl font-extrabold text-gray-900">{price}</span>
        </div>
      </div>

      <div className="flex-grow">
        <ul className="space-y-4">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              </div>
              <p className="ml-3 text-base text-gray-600">{feature}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8">
        <button
          onClick={onAction}
          disabled={isCurrent}
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all shadow-sm ${
            isCurrent
              ? 'bg-gray-100 text-gray-400 cursor-default'
              : 'bg-green-600 text-white hover:bg-green-700 hover:shadow-md'
          }`}
        >
          {isCurrent ? actionLabel : 'Upgrade'}
        </button>
      </div>
    </div>
  );
};

const PricingView: React.FC<PricingViewProps> = ({ t, currentTier, onUpgrade, onContactUs }) => {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">{t.pricingTab}</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Choose the plan that fits your nutritional goals.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {/* Free Plan */}
        <PricingCard
          tier="free"
          title={t.planFree}
          price="$0"
          features={[
            `${TIER_LIMITS.free} ${t.scansPerMonth}`,
            t.publicData,
            t.feature2Title,
            t.feature3Title
          ]}
          isCurrent={currentTier === 'free' || currentTier === 'guest'}
          onAction={() => {}}
          actionLabel={t.currentPlan}
        />

        {/* Starter Plan */}
        <PricingCard
          tier="starter"
          title={t.planStarter}
          price="$4.99"
          features={[
            `${TIER_LIMITS.starter} ${t.scansPerMonth}`,
            t.prioritySupport,
            t.feature1Title,
            t.feature2Title,
            t.feature3Title
          ]}
          isCurrent={currentTier === 'starter'}
          onAction={() => onUpgrade('starter')}
          actionLabel={t.currentPlan}
        />

        {/* Pro Plan */}
        <PricingCard
          tier="pro"
          title={t.planPro}
          price="$9.99"
          features={[
            `${TIER_LIMITS.pro} ${t.scansPerMonth}`,
            t.unlimitedScans.replace("Unlimited", `${TIER_LIMITS.pro}+`), // Adjust text slightly for realism
            t.prioritySupport,
            "Advanced Analytics",
            "Private Data"
          ]}
          isCurrent={currentTier === 'pro'}
          onAction={() => onUpgrade('pro')}
          actionLabel={t.currentPlan}
          isPopular={true}
        />

        {/* Enterprise Plan */}
        <PricingCard
          tier="enterprise"
          title={t.planEnterprise}
          price="Custom"
          features={[
            t.unlimitedScans,
            t.customSolutions,
            "API Access",
            "Dedicated Support",
            "SLA"
          ]}
          isCurrent={currentTier === 'enterprise'}
          onAction={onContactUs}
          actionLabel={t.contactUs}
        />
      </div>
    </div>
  );
};

export default PricingView;
