Epasta sūtīšana atrodas alpr.js failā iekš controllers mapes!

1)Palaižot pirmo reizi, konsolē ievadam komandu
docker-compose up

2)Ir liela varbūtība ka kaut kas nepareizi nokonfigurēts konteinerī, tāpēc jāpārlādē alpr konteineri ar komandu
docker restart alpr_nodejs  

3)Ieejam postam un izveidojam 2 endpointus
http://localhost:9091/enter
un 
http://localhost:9091/exit
Viņi accepto POST requestu ar body parametru "car" kā failu tipu

4)Atsūtot requestu, gadijumā ja vis strādā, payloads atgriezis image nosaukumu

5)Ejam pārbaudīt datubāzi
http://localhost:8081/db/docker-node-mongo/alprs

