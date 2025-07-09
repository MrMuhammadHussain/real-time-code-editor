const Client = ({username}) => {
  return (

    <div className="avatat">{username[0].toUpperCase()}
        <span className='username'>{username}</span>
</div>
  )
}

export default Client