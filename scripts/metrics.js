const REPO = '2024.1-PrintGo-ContractService';
const OWNER = 'fga-eps-mds';
const SONAR_ID = 'fga-eps-mds-1_2024-1-printgo-contractservice';

const METRIC_LIST = [
    'files',
    'functions',
    'complexity',
    'comment_lines_density',
    'duplicated_lines_density',
    'coverage',
    'ncloc',
    'tests',
    'test_errors',
    'test_failures',
    'test_execution_time',
    'security_rating'
];

const SONAR_URL = `https://sonarcloud.io/api/measures/component_tree?component=${SONAR_ID}&metricKeys=${METRIC_LIST.join(',')}&ps=500`;

module.exports = {
    SONAR_URL,
    REPO,
    OWNER
};