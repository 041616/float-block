import stickyBlock from '../../src/stickyBlock';

stickyBlock(
    document.getElementById('f01'),
    { relative: 'columns', classActive: 'active', top: 20, bottom: 10}
);
stickyBlock(
    document.getElementById('f02'),
    { relative: 'columns', classActive: 'active', top: 20, bottom: 10 }
);
