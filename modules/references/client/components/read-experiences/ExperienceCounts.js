// Internal dependencies
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import React from 'react';
import styled from 'styled-components';

// External dependencies
import { experienceType } from '@/modules/references/client/experiences.prop-types';
import Icon from '@/modules/core/client/components/Icon';

const Summary = styled.div`
  margin: 20px 0;
`;

const SummarySentence = styled.p`
  margin-bottom: 10px;
`;

const SummaryIcon = styled(Icon).attrs(() => ({
  // Props are static here so that we don't need to repeat them later in the code
  className: 'text-muted',
  fixedWidth: true,
}))`
  margin-right: 7px;
`;

export default function ExperienceCounts({ experiences }) {
  const { t } = useTranslation('references');

  console.log('experiences:', experiences); //eslint-disable-line

  const totalCount = experiences.length;

  const recommendCount = experiences.filter(
    ({ recommend }) => recommend === 'yes',
  ).length;

  const nonRecommendCount = experiences.filter(
    ({ recommend }) => recommend === 'no',
  ).length;

  // One sentence summary about experiences.
  const renderSummarySentece = () => {
    let summary;

    if (totalCount === 1 && recommendCount === 1) {
      summary = t(
        'One member shared their experience and they recommended them.',
      );
    } else if (totalCount === 1 && nonRecommendCount === 1) {
      summary = t(
        'One member shared their experience and they would not recommend them.',
      );
    } else {
      summary = t('{{count}} members have shared their experiences.', {
        count: totalCount,
      });
    }

    return <SummarySentence className="lead">{summary}</SummarySentence>;
  };

  // Details about recommendations.
  const renderRecommendationStats = () => {
    const summaries = [];

    if (totalCount === recommendCount) {
      summaries.push(t('Everyone recommends them.'));
    }

    if (totalCount === nonRecommendCount) {
      summaries.push(t('Everyone said they would not recommend them.'));
    }

    if (totalCount !== recommendCount && nonRecommendCount > 0) {
      summaries.push(
        t('{{count}} did not recommend.', {
          count: nonRecommendCount,
        }),
      );
    }

    if (totalCount !== recommendCount && recommendCount > 0) {
      summaries.push(
        t('{{count}} recommended them.', {
          count: recommendCount,
        }),
      );
    }

    return summaries.length > 0 ? (
      <p>
        <SummaryIcon icon={nonRecommendCount > 0 ? 'close' : 'ok'} />
        {summaries.join(' ')}
      </p>
    ) : null;
  };

  // Statistics about "met", "host", "guest" interactions.
  const renderInteractionStats = () => {
    const interactions = [];

    const getInteractionPercentage = interaction => {
      const count = experiences.filter(({ interactions }) =>
        Boolean(interactions[interaction]),
      ).length;

      return parseInt((count / totalCount) * 100, 10);
    };

    const met = getInteractionPercentage('met');
    const hostedMe = getInteractionPercentage('hostedMe');
    const hostedThem = getInteractionPercentage('hostedThem');

    if (hostedThem === 100) {
      interactions.push(t('They hosted everyone.'));
    } else if (hostedThem > 0) {
      interactions.push(
        t('They hosted {{percentage}}% of members.', {
          percentage: hostedThem,
        }),
      );
    }

    if (hostedMe === 100) {
      interactions.push(t('Was hosted by everyone.'));
    } else if (hostedThem > 0) {
      interactions.push(
        t('Was hosted by {{percentage}}% of members.', {
          percentage: hostedMe,
        }),
      );
    }

    if (met === 100) {
      interactions.push(t('Met with everyone.'));
    } else if (hostedThem > 0) {
      interactions.push(
        t('Met with {{percentage}}% of members.', {
          percentage: met,
        }),
      );
    }

    return interactions.length > 0 ? (
      <p>
        <SummaryIcon icon="tree" />
        {interactions.join(' ')}
      </p>
    ) : null;
  };

  // Statistics about genders
  const renderGenderStats = () => {
    const getGenderPercentage = value => {
      const count = experiences.filter(
        ({ userFrom: { gender } }) => gender === value,
      ).length;

      return parseInt((count / totalCount) * 100, 10);
    };

    const females = getGenderPercentage('female');
    const males = getGenderPercentage('male');

    const iconUser = <SummaryIcon icon="user" />;
    const iconUsers = <SummaryIcon icon="users" />;

    if (females === 100) {
      return (
        <p>
          {iconUser}
          {t('All experiences are by females members.')}
        </p>
      );
    }

    if (males === 100) {
      return (
        <p>
          {iconUser}
          {t('All experiences are by male members.')}
        </p>
      );
    }

    if (females > 0 && males > 0) {
      return (
        <p>
          {iconUsers}
          {t(
            '{{percentageFemales}}% of experiences are by females, and {{percentageMales}}% are by males.',
            {
              percentageFemales: females,
              percentageMales: males,
            },
          )}
        </p>
      );
    }

    if (females > 0) {
      return (
        <p>
          {iconUser}
          {t('{{percentage}}% of experiences are by females.', {
            percentage: females,
          })}
        </p>
      );
    }

    if (males > 0) {
      return (
        <p>
          {iconUser}
          {t('{{percentage}}% of experiences are by males.', {
            percentage: males,
          })}
        </p>
      );
    }

    return null;
  };

  return (
    <Summary>
      {renderSummarySentece()}
      {totalCount > 1 && renderRecommendationStats()}
      {totalCount > 2 && renderGenderStats()}
      {totalCount > 2 && renderInteractionStats()}
    </Summary>
  );
}

ExperienceCounts.propTypes = {
  experiences: PropTypes.arrayOf(experienceType).isRequired,
};
