function LoggedInName() {
  //var user = {};
  function doLogout(event: any): void {
    event.preventDefault();
    alert("doLogout");
  }
  return (
    <div id="loggedInDiv">
      <span id="userName">Logged In As John Doe </span>
      <br />
      <button
        type="button"
        id="logoutButton"
        className="buttons"
        onClick={doLogout}
      >
        {" "}
        Log Out{" "}
      </button>
    </div>
  );
}
export default LoggedInName;
