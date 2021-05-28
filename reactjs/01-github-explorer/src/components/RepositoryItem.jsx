export function RepositoryItem(props) {
  return (
    <li>
      <strong>{props.repository?.name ?? 'Default'}</strong>
      <p>{props.repository.description}</p>
      <a href={props.repository.link} target="_blanck">Acessar repositório</a>
    </li>
  );
}