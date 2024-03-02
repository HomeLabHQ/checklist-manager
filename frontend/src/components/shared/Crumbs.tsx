import { useMatches } from 'react-router-dom';

import { Anchor, Breadcrumbs } from '@mantine/core';

type link = {
  title: string;
  href: string;
};
function Crumbs() {
  const matches = useMatches();
  const links: link[] = [];
  matches.forEach((match) => {
    links.push({ title: 'Projects', href: '/' });
    if (match.params.project) {
      links.push({ title: match.params.project, href: `/project/${match.params.project}/` });
    }
    if (match.params.template) {
      links.push({
        title: 'Checklist',
        href: `/project/${match.params.project}/checklist/${match.params.template}/`,
      });
    }
  });

  return (
    <Breadcrumbs>
      {links.map((item, index) => (
        <Anchor href={item.href} key={index}>
          {item.title}
        </Anchor>
      ))}
    </Breadcrumbs>
  );
}

export default Crumbs;
