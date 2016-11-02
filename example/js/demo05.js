import stickyBlock from '../../src/stickyBlock';

stickyBlock(
    document.getElementById('float-block'),
    { relative: 'main', top: 20, bottom: 20, indent: 20 }
);
