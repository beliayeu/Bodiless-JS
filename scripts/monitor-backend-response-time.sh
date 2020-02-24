while sleep 0.5;
  do curl -o /dev/null -s -w 'Total: %{time_total}s\n' http://localhost:8005/___backend/ping;
done