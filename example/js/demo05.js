import stickyBlock from '../../src/stickyBlock';

stickyBlock(
    document.getElementById('float-block'),
    { relative: 'container', top: 20, bottom: 20 }
);
