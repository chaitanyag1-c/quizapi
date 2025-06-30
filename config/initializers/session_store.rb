Rails.application.config.session_store :cookie_store,
  key: '_your_app_session',
  same_site: :lax, # or :none if using HTTPS
  secure: false,   # true if on HTTPS
  domain: nil      # keep nil for localhost
