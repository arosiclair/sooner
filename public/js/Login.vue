<template>
  <div>
    <img id="logo" src="https:/via.placeholder.com/150" alt="logo"/>
    <form>
      <div id="loginFields" action="#">
        <input id="name" class="first" type="text" placeholder="Name" />
        <input id="email" type="text" placeholder="Email" />
        <input id="password" class="last" type="password" placeholder="Password" />
      </div>
      <button id="loginButton" type="submit">LOGIN</button>
    </form>    
  </div>
</template>

<script>
export default {
    name: 'login'
}
</script>

<style>
    #loginFields {
        border-radius: 5px;
        overflow: hidden;
        box-shadow: 0 2px 4px 0;
        margin-bottom: 20px;
    }

    #logo {
        margin-bottom: 50px;
    }

    input{
        width: 100%;
        font-size: 24px;
        padding: 15px;
        margin: 0;
        
        border-top: none;
        border-right: none;
        border-left: none;
        border-bottom: 1px solid #ffffff;
        
        transition: 300ms ease;
    }
    input:hover {
        background-color: #c6c6c6;
        border-bottom: 1px solid #c6c6c6;
    }
    input:focus {
        outline: none;
        border-bottom: 1px solid #28b5f4;
    }

    #loginButton {
        width: 100%;
        height: 66px;
        background-color: #ffffff;
        border: none;
        
        font-size: 24px;
        color: rgba(0,0,0,0.70);
        box-shadow: 0 2px 4px 0;   
        border-radius: 4px;
        
        transition: 0.5s ease;
    }
    #loginButton:focus {
        outline: none;
    }
    #loginButton:hover {
        box-shadow: 0 2px 15px 0px;
    }
</style>
